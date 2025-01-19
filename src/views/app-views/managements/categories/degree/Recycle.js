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
    EyeOutlined, CopyOutlined, SettingOutlined, AlignLeftOutlined, FilterOutlined, RedoOutlined
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

const Recycle = () => {
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
        else searchList(dataSearch);
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
            res = await API.recycle(page, size, sorter.order, sorter.field, value);
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

    const restore = (id) => {
        confirm({
            title: 'Bạn có muốn khôi phục không?',
            onOk: async () => {
                try {
                    const res = await API.restore(id);
                    if (res) {
                        setList(list.filter(item => item.id !== id));
                        message.success('Khôi phục thành công');
                    } else {
                        message.error('Khôi phục thất bại');
                    }
                } catch (error) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Khôi phục bị hủy');
            },
        });
    };

    const massRestore = () => {
        confirm({
            title: 'Bạn có muốn khôi phục không?',
            onOk: async () => {
                try {
                    const res = await API.forceDeleteMultiple(selectedRowKeys);
                    if (res) {
                        getList(selectedSorter, dataSearch);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        message.success('Khôi phục thành công');
                    } else {
                        message.error('Khôi phục thất bại');
                    }
                } catch (e) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Khôi phục bị hủy');
            },
        });
    };

    const restoreAll = (id) => {
        confirm({
            title: 'Bạn có muốn khôi phục không all?',
            onOk: async () => {
                try {
                    const res = await API.restoreAll(id);
                    if (res) {
                        setList(list.filter(item => item.id !== id));
                        message.success('Khôi phục thành công');
                    } else {
                        message.error('Khôi phục thất bại');
                    }
                } catch (error) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Khôi phục bị hủy');
            },
        });
    };

    const destroy = (id) => {
        confirm({
            title: 'Do you want to delete?',
            onOk: async () => {
                try {
                    const res = await API.forceDelete(id);
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
                    const res = await API.forceDeleteMultiple(selectedRowKeys);
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

    const deleteAll = (id) => {
        confirm({
            title: 'Do you want to delete all?',
            onOk: async () => {
                try {
                    const res = await API.forceDeleteAll(id);
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


    const openRecycle= () => {
        history.push(`/app/managements/categories/degree/import`);
    };

    const exportView = (ids) => {
        const data = selectedRows;
        history.push({
            pathname: '/app/managements/categories/degree/export',
            state: { data }
        });
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
                    <Tooltip title="Khôi phục">
                        <Button
                            className="mr-2 border-0"
                            icon={<RedoOutlined />}
                            onClick={() => restore(elm.id)} size="small"/>
                    </Tooltip>
                </div>
            ),
            key: '7'
        }
    ]

    const dropdownMenu = elm => (
        <Menu>
            {/*<Menu.Item onClick={() => copy(elm.id)}>*/}
            {/*    <Flex alignItems="center">*/}
            {/*        <CopyOutlined />*/}
            {/*        <span className="ml-2">Copy</span>*/}
            {/*    </Flex>*/}
            {/*</Menu.Item>*/}
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
        { label: 'Khôi phục toàn bộ dữ liệu', event: restoreAll, icon: <AlignLeftOutlined /> },
        { label: 'Khôi phục dữ  đã chọn', event: massRestore, icon: <AlignLeftOutlined /> },
        { label: 'Xuất dữ liệu đã chọn theo mẫu', event: exportView, icon: <AlignLeftOutlined /> },
        { label: 'Xóa toàn bộ dữ liệu', event: deleteAll, icon: <AlignLeftOutlined /> },
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
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <div className="mr-md-3">
                        <Select
                            defaultValue="Select"
                            className="w-100"
                            style={{minWidth: 228, maxWidth: 200, width: "auto"}}
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
            <div className="d-flex justify-content-end mb-4">
                <Button type="primary" onClick={cancel} style={{marginTop: 16}}>
                    Trở về danh sách
                </Button>
            </div>
        </Card>
    )
}

export default Recycle