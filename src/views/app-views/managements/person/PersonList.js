import React, {useEffect, useState} from 'react'
import {
    Card,
    Table,
    Select,
    Input,
    Button,
    message,
    Modal,
    Menu,
    Pagination,
    Checkbox,
    Space,
    Dropdown, Tooltip
} from 'antd';
import {
    EditOutlined, DeleteOutlined,
    EyeOutlined, CopyOutlined, SettingOutlined, AlignLeftOutlined
} from '@ant-design/icons' ;
import { useHistory } from "react-router-dom";
import {debounce, isUndefined} from 'lodash';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import utils from 'utils';
import personService from 'services/PersonService';
import AvatarStatus from "components/shared-components/AvatarStatus";
import {API_BASE_URL} from "constants/ApiConstant";
// import

const { Option } = Select
const { confirm } = Modal;
const { Search } = Input;

const PersonList = () => {
    let history = useHistory();
    const personAPI = personService();
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

    //api
    useEffect(() => {
        if (dataSearch === "") getList(selectedSorter);
        else searchList(dataSearch);
    }, [page, size, selectedSorter, dataSearch])

    //get
    const getList = async (sorter, value) => {
        try {
            setLoading(true);
            let res;
            if (isUndefined(sorter.order)) {
                // sessionStorage.clear();
                sorter.order = 'desc';
                sorter.field = 'updated_at';
            } else {
                if (sorter.order === 'ascend') {
                    sorter.order = 'asc';
                } else if (sorter.order === 'descend') {
                    sorter.order = 'desc';
                }
            }
            res = await personAPI.get_by_page(page, size, sorter.order, sorter.field, value);
            if (res) {
                setList(res.records)
                setSelectedTotal(res.page_info.total_items);
            } else {
                message.error('Error data');
            }
        } catch (error) {
            history.push(`/auth/error-1`);
        } finally {
            setLoading(false);
        }
    }

    //search
    const searchList = async (value) => {
        try {
            setLoading(true);
            let res;
            res = await personAPI.search(value);

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
    }
    const onSearch = (value) => {
        setDataSearch(value);
    }

    const onShowSizeChange = (current, size) => {
        setLoading(true);
        setSize(size);

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const onChangePage = (page) => {
        setLoading(true);
        setPage(page);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    // function onSearch(e) {
    //     const value = e.currentTarget.value;
    //     setDataSearch(value);
    //     getList(selectedSorter, value);
    //     debounceGetList(selectedSorter, value);
    //     sessionStorage.clear();
    // }
    //sort
    const onChangeSort = (pagination, filters, sorter) => {
        resetPagination();
        setPage('1');
        setSelectedSorter(sorter);
        // sessionStorage.clear();
    }

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
        setTableKey(`table-${Math.random()}`);  //  đổi key để ép re-render
    };

    //copy
    const copy = (id) => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    const res = await personAPI.copy(id);
                    if (res) {
                        history.push(`/app/managements/person/copy-person`, {res})
                        // setPersonProfileVisible(true);
                        // setSelectedPerson(res.data.id);
                        getList(selectedSorter, dataSearch);
                        message.success('Sao chép thành công');
                    } else {
                        message.error('Sao chép thất bại');
                    }
                } catch (error) {
                    // history.push(`/auth/error-1`);
                    console.log(error);
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
    }

    // copy multiple
    const mass_copy = () => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    // const ids = selectedRowKeys;
                    const res = await personAPI.mass_copy(selectedRowKeys);
                    if (res) {
                        // console.log(res)
                        setSelectedRowKeys([]);
                        history.push(`/app/managements/person/view-mass-copy`, {res});
                        getList(selectedSorter, dataSearch);
                        message.success('Copying successful');
                    } else {
                        message.error('Error copying');
                    }
                } catch(e) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
    }

    //delete
    const destroy = (id) => {
        confirm({
            title: 'Do you want to delete?',
            onOk: async () => {
                try {
                    const res = await personAPI.destroy(id);

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
    }

    //delete multiple
    const mass_delete= () => {
        confirm({
            title: 'Do you want to delete?',
            onOk: async () => {
                try {
                    const res = await personAPI.mass_delete(selectedRowKeys);

                    if (res) {
                        getList(selectedSorter, dataSearch);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        message.success('Xóa thành công');
                    } else {
                        message.error('Xóa thất bại');
                    }
                } catch (e){
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    }

    //in-out-view
    const addPerson = () => {
        history.push(`/app/managements/person/add-person`);
    };

    const viewDetail= (id) => {
        history.push(`/app/managements/person/edit-person`, {id});
    };

    //import view
    const importView = () => {
        history.push(`/app/managements/person/import-person`);
    }

    //export view
    const exportView = (ids) => {
        const data = selectedRows;
        history.push({
            pathname: '/app/managements/person/export-person',
            state: { data }
        });
    }

    // Change status
    const confirmStatus = async (e, elm) => {
        let status;
        e === 'active' ? (status = 'in active') : (status = 'active');
        const res = await personAPI.updateStatus(elm.id, status);
        if (res) {
            getList(selectedSorter, dataSearch);
            message.success('Update successful');
        } else {
            message.error('Error updating data');
        }
    };
    const cancelStatus = (e) => {
        message.error('Change cancelled');
    };

    //tableColumns
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
            title: 'CCCD/CMND',
            dataIndex: 'identification',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'identification'),
            key: '3'
        },
        {
            title: 'Họ và tên đệm',
            dataIndex: 'first_name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'first_name'),
            key: '4'
        },
        {
            title: 'Tên',
            dataIndex: 'last_name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'last_name'),
            key: '5'
        },
        {
            title: 'Ảnh đại diện',
            // dataIndex: 'name',
            render: (_, record) => (
                <div className="d-flex">
                    <AvatarStatus src={`${API_BASE_URL}/storage/${record.avatar}`}/>
                    {/*<AvatarStatus src={'#'}/>*/}
                </div>
            ),
            key: '6'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'email'),
            key: '7'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'phone_number'),
            key: '8'
        },
        {
            title: 'Học vị',
            dataIndex: 'degree_id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'degree_id'),
            render: (degree_id) => {
                if (degree_id === 1) {
                    return 'ThS';
                } else if (degree_id === 2) {
                    return 'TS';
                } else {
                    return 'N/A'; // Nếu không khớp, hiển thị giá trị mặc định
                }
            },
            key: '9'
        },
        {
            title: 'Học hàm',
            dataIndex: 'academic_rank_id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'academic_rank_id'),
            render: (academic_rank_id) => {
                if (academic_rank_id === 1) {
                    return 'PGS';
                } else if (academic_rank_id === 2) {
                    return 'GS';
                } else {
                    return 'N/A';
                }
            },
            key: '10'
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
                            onClick={()=> destroy(elm.id)}
                            size="small"
                            // danger={elm.students_count === 0 ? true : false}
                            // disabled={elm.students_count === 0 ? false : true}
                        />
                    </Tooltip>
                    <Tooltip title="View">
                        <Button
                            className="mr-2 border-0"
                            icon={<EditOutlined />}
                            onClick={() => editPerson(elm.id)} size="small"/>
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
            key: '11'
        }
    ];

    const dropdownMenu = elm => (
        <Menu>
            {/*<Menu.Item onClick={() => editPerson(elm.id)}>*/}
            {/*    <Flex alignItems="center">*/}
            {/*        <EditOutlined />*/}
            {/*        <span className="ml-2">Edit</span>*/}
            {/*    </Flex>*/}
            {/*</Menu.Item>*/}
            <Menu.Item onClick={() => copy(elm.id)}>
                <Flex alignItems="center">
                    <CopyOutlined />
                    <span className="ml-2">Copy</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    //filter
    const excludeDataIndex = ['id', 'identification', 'email'];
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
            <div style={{padding: '10px'}}>
                <Checkbox.Group
                    value={checkedList}
                    options={options}
                    onChange={(value) => {
                        setCheckedList(value);
                    }}
                    style={{display: 'flex', flexDirection: 'column'}} // Add this line or use a className
                />
            </div>
        </Menu>
    );

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows);
            setSelectedRowKeys(key);
            console.log('setSelectedRowKeys:', key)
        }
    }
    const [personProfileVisible, setPersonProfileVisible] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState();

    const editPerson = (id) => {
        history.push(`/app/managements/person/edit-person`, {id});
    };

    const closeEditPerson = async () => {
        // getList(selectedSorter, dataSearch);
        getList(selectedSorter, dataSearch);
        setPersonProfileVisible(false);
        setSelectedPerson(null);
    };

    const action = [
        { label: 'Nhập dữ liệu từ file', event:  importView, icon: <AlignLeftOutlined />},
        { label: 'Xuất dữ liệu đã chọn theo mẫu', event: exportView, icon: <AlignLeftOutlined /> },
        { label: 'Sao chép dữ liệu đã chọn', event: mass_copy, icon: <AlignLeftOutlined /> },
        { label: 'Xóa dữ liệu đã chọn', event: mass_delete, icon: <AlignLeftOutlined /> },
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
                            style={{
                                width: 200,
                            }}
                        />
                    </div>
                    <div className="mr-md-3" style={{display:'flex', maxWidth: 150}}>
                        <Button
                            onClick={addPerson}
                            type="primary"
                            style={{borderRadius: '0', borderRightColor: 'white', background: '#666CFF'}}
                            className="rounded-left"
                            block>
                            Thêm mới
                        </Button>

                        <Space wrap>
                            <Dropdown
                                overlay={menu}
                                trigger={['click']}
                                placement="bottomLeft"
                            >
                                <Button type="primary"
                                        style={{borderRadius: '0', background: '#666CFF'}}
                                        className="rounded-right"
                                        icon={<SettingOutlined/>}>
                                </Button>
                            </Dropdown>
                        </Space>
                    </div>
                </Flex>
            </Flex>
            <div className="table-responsive">
                <Table
                    // classname={".ant-table-tbody"}
                    columns={newTableColumns}
                    dataSource={list}
                    rowKey='id'
                    loading={loading}
                    rowPersonName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        type: 'checkbox',
                        onChange: () => {

                        },
                        preserveSelectedRowKeys: false,
                        ...rowSelection,
                        // getCheckboxProps: (elm) => {
                        //     if (selectedAction && selectedAction.label === 'Delete' && elm.students_count !== 0 ) {
                        //         return {disabled: true};
                        //     }
                        // },
                    }}
                    pagination={false}
                    onChange={onChangeSort}
                />
                <br/>
                <div className="text-right">
                    <Pagination
                        // simple
                        key={tableKey}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        onChange={onChangePage}
                        total={selectedTotal}
                    />
                </div>
            </div>
            {/*<EditPerson id={ selectedPerson} visible={personProfileVisible} close={() => (closeEditPerson())}/>*/}
        </Card>
    )
}

export default PersonList
