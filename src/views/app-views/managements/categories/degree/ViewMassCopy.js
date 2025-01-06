import React, { useEffect, useState } from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    message,
    Modal,
    Menu,
    Checkbox,
    Tooltip,
    Popconfirm,
    Tag,
    Table,
    Space,
    Dropdown
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    AlignLeftOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import degreeService from 'services/categories/DegreeService';
import Edit from './Edit';

const { Option } = Select;
const { confirm } = Modal;

const ViewMassCopy = ({ ids }) => {
    const history = useHistory();
    const API = degreeService();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedRows, setSelectedRows] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedSorter, setSelectedSorter] = useState({});
    const [selectedAction, setSelectedAction] = useState(null);

    const [degreeProfileVisible, setDegreeProfileVisible] = useState(false);
    const [selectedDegree, setSelectedDegree] = useState();

    const [checkedList, setCheckedList] = useState([]);
    const excludeDataIndex = ['id'];

    const action = [
        { label: 'Xóa dữ liệu đã chọn', event: massDelete, icon: <AlignLeftOutlined /> },
    ];

    useEffect(() => {
        if (ids && ids.length > 0) {
            getList();
        }
    }, [ids]);

    const getList = async () => {
        setLoading(true);
        try {
            const res = await API.getByIds(ids);
            if (res) {
                setList(res.records);
            } else {
                message.error('Lỗi khi lấy dữ liệu');
            }
        } catch (error) {
            message.error('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const destroy = (id) => {
        confirm({
            title: 'Bạn có muốn xóa mục này?',
            onOk: async () => {
                try {
                    const res = await API.destroy(id);
                    if (res) {
                        setList(list.filter(item => item.id !== id));
                        message.success('Xóa thành công');
                    } else {
                        message.error('Xóa thất bại');
                    }
                } catch (error) {
                    message.error('Lỗi hệ thống');
                }
            },
            onCancel() {
                message.info('Xóa đã bị hủy');
            },
        });
    };

    const massDelete = () => {
        confirm({
            title: 'Bạn có muốn xóa các mục đã chọn?',
            onOk: async () => {
                try {
                    const res = await API.massDelete(selectedRowKeys);
                    if (res) {
                        setList(list.filter(item => !selectedRowKeys.includes(item.id)));
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        message.success('Xóa thành công');
                    } else {
                        message.error('Xóa thất bại');
                    }
                } catch (error) {
                    message.error('Lỗi hệ thống');
                }
            },
            onCancel() {
                message.info('Xóa đã bị hủy');
            },
        });
    };

    const editDegree = (id) => {
        setDegreeProfileVisible(true);
        setSelectedDegree(id);
    };

    const closeEditDegree = () => {
        setDegreeProfileVisible(false);
        setSelectedDegree(null);
    };

    const confirmStatus = async (is_default, elm) => {
        const status = !is_default;
        const res = await API.updateStatus(elm.id, status);
        if (res) {
            message.success('Cập nhật thành công');
        } else {
            message.error('Cập nhật thất bại');
        }
    };

    const cancelStatus = () => {
        message.error('Thay đổi đã bị hủy');
    };

    const handleSelectChange = (value) => {
        const actionItem = action.find(act => act.label === value);
        setSelectedAction(actionItem);
    };

    const handleButtonClick = () => {
        if (selectedAction && selectedAction.event) {
            selectedAction.event();
        } else {
            message.info('Chưa chọn hành động');
        }
    };

    const tableColumns = [
        {
            title: 'STT',
            dataIndex: 'index',
            render: (_, __, index) => index + 1,
            key: '1',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id'),
            key: '2'
        },
        {
            title: 'Mã học vị',
            dataIndex: 'code',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'code'),
            key: '3'
        },
        {
            title: 'Tên học vị',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name'),
            key: '4'
        },
        {
            title: 'Mặc định',
            dataIndex: 'is_default',
            render: (is_default, elm) => (
                <Popconfirm
                    title="Thay đổi mặc định"
                    description="Bạn có muốn thay đổi?"
                    onConfirm={() => confirmStatus(is_default, elm)}
                    onCancel={cancelStatus}
                    okText="Yes"
                    cancelText="No"
                >
                    <Tag className="text-capitalize" color={is_default ? 'cyan' : 'red'}>
                        {is_default ? 'True' : 'False'}
                    </Tag>
                </Popconfirm>
            ),
            key: '5'
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="Delete">
                        <Button
                            className="mr-2 border-0"
                            icon={<DeleteOutlined />}
                            onClick={() => destroy(elm.id)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            className="mr-2 border-0"
                            icon={<EditOutlined />}
                            onClick={() => editDegree(elm.id)} size="small"/>
                    </Tooltip>
                </div>
            ),
            key: '6'
        }
    ];

    const options = tableColumns.map(({ key, title }) => ({
        label: title || 'Action',
        value: key,
    }));

    const newTableColumns = tableColumns.filter(item => checkedList.includes(item.key));

    const menu = (
        <Menu>
            <div style={{ padding: '10px' }}>
                <Checkbox.Group
                    value={checkedList}
                    options={options}
                    onChange={(value) => {
                        setCheckedList(value);
                    }}
                    style={{ display: 'flex', flexDirection: 'column' }}
                />
            </div>
        </Menu>
    );

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows);
            setSelectedRowKeys(key);
        }
    };

    return (
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <Select
                            defaultValue="Select"
                            className="w-100"
                            style={{ minWidth: 228, maxWidth: 200, width: 'auto' }}
                            onChange={handleSelectChange}
                        >
                            <Option value="Select">Hành động</Option>
                            {
                                action.map(elm => (
                                    <Option value={elm.label} key={elm.label}>
                                        {elm.icon}
                                        <span className="ml-2">{elm.label}</span>
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="mr-md-3">
                        <Button type="primary" onClick={handleButtonClick}>Thực hiện</Button>
                    </div>
                </Flex>
            </Flex>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space wrap>
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <Button
                            type="primary"
                            style={{ borderRadius: '0', background: '#666CFF' }}
                            className="rounded"
                            icon={<SettingOutlined />}
                        />
                    </Dropdown>
                </Space>
            </div>
            <div className="table-responsive">
                <Table
                    columns={newTableColumns}
                    dataSource={list}
                    rowKey="id"
                    loading={loading}
                    rowSelection={{
                        selectedRowKeys,
                        type: 'checkbox',
                        preserveSelectedRowKeys: false,
                        ...rowSelection,
                    }}
                />
            </div>
            <Edit id={selectedDegree} visible={degreeProfileVisible} close={closeEditDegree} />
        </Card>
    );
};

export default ViewMassCopy;
