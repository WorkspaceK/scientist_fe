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
    EyeOutlined, CopyOutlined, SettingOutlined, AlignLeftOutlined, FilterOutlined
} from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { debounce, isUndefined } from 'lodash';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import degreeService from "services/categories/DegreeService";
import Edit from "./Edit";

const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;

const List = () => {
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

    useEffect(() => {
        if (dataSearch === "") getList(selectedSorter);
        else getList(dataSearch);
    }, [page, size, selectedSorter, dataSearch]);

    const getList = async (sorter, value) => {
        try {
            setLoading(true);
            let res;
            if (isUndefined(sorter.order)) {
                sorter.order = 'desc';
                sorter.field = 'updated_at';
            } else {
                sorter.order = sorter.order === 'ascend' ? 'asc' : 'desc';
            }
            res = await API.getByPage(page, size, sorter.order, sorter.field, value);
            if (res) {
                setList(res.records);
                setSelectedTotal(res.page_info.total_items);
            } else {
                message.error('Error data');
            }
        } catch (error) {
            history.push(`/auth/error-1`);
        } finally {
            setLoading(false);
        }
    };

    const searchList = async (value) => {
        try {
            setLoading(true);
            const res = await API.search(value);
            if (res) {
                setList(res);
            } else {
                message.error('Error data');
            }
        } catch (error) {
            history.push(`/auth/error-1`);
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

    const copy = (id) => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    const res = await API.copy(id);
                    if (res) {
                        history.push(`/app/managements/categories/degree/copy`, { res });
                        getList(selectedSorter, dataSearch);
                        message.success('Sao chép thành công');
                    } else {
                        message.error('Sao chép thất bại');
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
    };

    const massCopy = () => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    const res = await API.massCopy(selectedRowKeys);
                    if (res) {
                        setSelectedRowKeys([]);
                        history.push(`/app/managements/categories/degree/view-mass-copy`, {res});
                        getList(selectedSorter, dataSearch);
                        message.success('Copying successful');
                    } else {
                        message.error('Error copying');
                    }
                } catch (e) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
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

    const addDegree = () => {
        history.push(`/app/managements/categories/degree/add`);
    };

    const viewDetail = (id) => {
        history.push(`/app/managements/categories/degree/view-detail`, { id });
    };

    const importView = () => {
        history.push(`/app/managements/categories/degree/import`);
    };

    const openRecycle= () => {
        history.push(`/app/managements/categories/degree/recycle`);
    };

    const exportView = (ids) => {
        const data = selectedRows;
        history.push({
            pathname: '/app/managements/categories/degree/export',
            state: { data }
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
            sorter: (a, b) => utils.antdTableSorter(a, b, 'is_default'),
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
                            icon={<DeleteOutlined />}
                            onClick={() => destroy(elm.id)}
                            size="small"
                            danger={elm.persons_count === 0 ? true : false}
                            disabled={elm.persons_count === 0 ? false : true}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            className="mr-2 border-0"
                            icon={<EditOutlined />}
                            onClick={() => editDegree(elm.id)} size="small"
                        />
                    </Tooltip>
                    <Tooltip title="View">
                        <Button
                            className="mr-2 border-0"
                            icon={<EyeOutlined />}
                            onClick={() => viewDetail(elm.id)} size="small"/>
                    </Tooltip>
                    <EllipsisDropdown menu={dropdownMenu(elm)}/>
                </div>
            ),
            key: '7'
        }
    ]

    const dropdownMenu = elm => (
        <Menu>
            <Menu.Item onClick={() => copy(elm.id)}>
                <Flex alignItems="center">
                    <CopyOutlined />
                    <span className="ml-2">Copy</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

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
        { label: 'Nhập dữ liệu từ file', event: importView, icon: <AlignLeftOutlined /> },
        { label: 'Xuất dữ liệu đã chọn theo mẫu', event: exportView, icon: <AlignLeftOutlined /> },
        { label: 'Sao chép dữ liệu đã chọn', event: massCopy, icon: <AlignLeftOutlined /> },
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

    return (
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <Select
                            defaultValue="Select"
                            className="w-100"
                            style={{ minWidth: 228, maxWidth: 200, width: "auto" }}
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
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <div className="mr-md-3">
                            <Button type="primary" onClick={openRecycle}>Thùng rác</Button>
                        </div>
                    </div>
                    <div className="mr-md-3">
                        <Search
                            placeholder="Tìm kiếm"
                            allowClear
                            onSearch={onSearch}
                            style={{width: 200}}
                        />
                    </div>
                    <div className="mr-md-3" style={{display: 'flex', maxWidth: 150}}>
                        <Button
                            onClick={addDegree}
                            type="primary"
                            style={{borderRadius: '0', borderRightColor: 'white', background: '#666CFF'}}
                            className="rounded-left"
                            block>
                            Thêm mới
                        </Button>

                        <Space wrap>
                            <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                                <Button type="primary"
                                        style={{borderRadius: '0', background: '#666CFF'}}
                                        className="rounded-right"
                                        icon={<FilterOutlined/>}></Button>
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
                <br />
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
            <Edit id={selectedDegree} visible={degreeProfileVisible} close={closeEditDegree} />
        </Card>
    )
}

export default List