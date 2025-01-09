import React, {useEffect, useState} from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    message,
    Modal,
    Menu,
    Pagination,
    Checkbox,
    Space,
    Dropdown, Tooltip, Popconfirm, Tag, Table
} from 'antd';
import {
    EditOutlined, DeleteOutlined,
    EyeOutlined, CopyOutlined, SettingOutlined, AlignLeftOutlined, ExportOutlined, FilterOutlined
} from '@ant-design/icons';
import {useHistory, useLocation} from "react-router-dom";
import { debounce, isUndefined } from 'lodash';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import degreeService from "services/categories/DegreeService";
import Edit from "./Edit";

const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;
const ViewMassCopy = () => {
    let history = useHistory();
    const API = degreeService();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedRows, setSelectedRows] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [selectedTotal, setSelectedTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [dataSearch, setDataSearch] = useState('');
    const [selectedSorter, setSelectedSorter] = useState({});
    const [selectedAction, setSelectedAction] = useState(null);

    const location = useLocation();
    const { res } = location.state || { res: [] };
    const codes = Array.isArray(res) ? res.map((item) => item.code) : [];
    const ids = res.map(item => item.id);

    useEffect(() => {
        if (ids && ids.length > 0) {
            getList();
        }
    }, []);

    const getList = async () => {
        setLoading(true);
        try {
            const res = await API.getByIds(ids);
            if (res) {
                setList(res);
            } else {
                message.error('Lỗi khi lấy dữ liệu');
            }
        } catch (error) {
            message.error('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (value) => {
        setDataSearch(value);
    };

    const onShowSizeChange = (current, size) => {
        setSize(size);
    };

    const onChangePage = (page) => {
        setPage(page);
    };

    const onChangeSort = (pagination, filters, sorter) => {
        resetPagination();
        setPage(1);
        setSelectedSorter(sorter);
    };

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [tableKey, setTableKey] = useState('table-1');

    const resetPagination = () => {
        setPagination({
            current: 1,
            pageSize: pagination.pageSize,
            total: pagination.total,
        });
        setTableKey(`table-${Math.random()}`);
    };

    const destroy = (id) => {
        confirm({
            title: 'Do you want to delete?',
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
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    };

    const massDelete = () => {
        confirm({
            title: 'Do you want to delete?',
            onOk: async () => {
                try {
                    const res = await API.massDelete(selectedRowKeys);
                    if (res) {
                        getList(selectedSorter, dataSearch);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        message.success('Xóa thành công');
                    } else {
                        message.error('Xóa thất bại');
                    }
                } catch (e) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    };

    const confirmStatus = async (is_default, elm) => {
        const status = !is_default;
        const res = await API.updateStatus(elm.id, status);
        if (res) {
            getList(selectedSorter, dataSearch);
            message.success('Update successful');
        } else {
            message.error('Error updating data');
        }
    };

    const cancelStatus = () => {
        message.error('Change cancelled');
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
            title: 'Mô tả',
            dataIndex: 'description',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'description'),
            key: '5'
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
            key: '6'
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="Delete">
                        <Button
                            className="mr-2 border-0"
                            danger
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
            key: '7'
        }
    ]

    const excludeDataIndex = ['id'];
    const defaultCheckedList = tableColumns
        .filter(item => !excludeDataIndex.includes(item.dataIndex))
        .map(item => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
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
                    onChange={(value) => setCheckedList(value)}
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

    const [degreeProfileVisible, setDegreeProfileVisible] = useState(false);
    const [selectedDegree, setSelectedDegree] = useState();

    const editDegree = (id) => {
        setDegreeProfileVisible(true);
        setSelectedDegree(id);
    };

    const closeEditDegree = () => {
        getList(selectedSorter, dataSearch);
        setDegreeProfileVisible(false);
        setSelectedDegree(null);
    };

    const action = [
        { label: 'Xóa dữ liệu đã chọn', event: massDelete, icon: <AlignLeftOutlined /> },
    ];

    const handleSelectChange = (value) => {
        const actionItem = action.find(act => act.label === value);
        setSelectedAction(actionItem);
    };

    const handleButtonClick = () => {
        if (selectedAction && selectedAction.event) {
            selectedAction.event();
        } else {
            message.info('No action selected');
        }
    };

    const cancel = () => {
        history.push(`/app/managements/categories/degree/list`);
    };

    return (

    <Card>
        <div className="text-center mb-4">
            <h2 className="font-weight-semibold">Sao chép thành công</h2>
            <p>Có thể hiệu chỉnh thông tin sau khi sao chép</p>
        </div>
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <Button
                                onClick={massDelete}
                                style={{ borderColor: 'red', color: 'red' }}
                        >
                            Xóa dữ liệu đã chọn</Button>
                    </div>
                </Flex>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <Search
                            placeholder="Tìm kiếm"
                            allowClear
                            onSearch={onSearch}
                            style={{width: 200}}
                        />
                    </div>
                    <div className="mr-md-3" style={{display: 'flex', maxWidth: 150}}>
                        <Space wrap>
                            <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                                <Button type="primary"
                                        style={{borderRadius: '0', background: '#666CFF'}}
                                        className="rounded"
                                        icon={<FilterOutlined />}></Button>
                            </Dropdown>
                        </Space>
                    </div>
                </Flex>
            </Flex>
            <div className="table-responsive">
                <Table
                    columns={newTableColumns}
                    dataSource={list}
                    rowKey='id'
                    loading={loading}
                    rowSelection={{
                        selectedRowKeys,
                        type: 'checkbox',
                        preserveSelectedRowKeys: false,
                        ...rowSelection,
                    }}
                    pagination={false}
                    onChange={onChangeSort}
                />
                <br/>
                <div className="text-right">
                    <Pagination
                        key={tableKey}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        onChange={onChangePage}
                        total={selectedTotal}
                    />
                </div>
            </div>
            <Edit id={selectedDegree} visible={degreeProfileVisible} close={closeEditDegree}/>
        </Card>
        <div className="d-flex justify-content-end mb-4">
            <Button type="primary" onClick={cancel} style={{marginTop: 16}}>
                Trở về danh sách
            </Button>
        </div>
    </Card>
    )
}

export default ViewMassCopy