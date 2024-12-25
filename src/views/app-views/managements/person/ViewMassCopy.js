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
    Tooltip, Space, Dropdown, Row, Col
} from 'antd';
import {
    EditOutlined, DeleteOutlined, SettingOutlined,
} from '@ant-design/icons' ;
import {useHistory, useLocation} from "react-router-dom";
import {debounce, isUndefined} from 'lodash';
import utils from 'utils';
import personService from 'services/PersonService';
import AvatarStatus from "components/shared-components/AvatarStatus";
import {API_BASE_URL} from "constants/ApiConstant";
import EditPerson from "./EditPerson";
import Flex from "../../../../components/shared-components/Flex";
import EditCopyPerson from "./ViewDetail";

const { confirm } = Modal;

const ViewMassCopy = () => {
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

    const location = useLocation();
    const { res } = location.state || { res: [] };
    const codes = Array.isArray(res) ? res.map((item) => item.code) : [];
    const ids = res.map(item => item.id);
    //api
    useEffect(() => {
        // getList(selectedSorter);
        setList(res)
    }, [])

    //get
    const getList = async (res) => {
        try {
            res = await personAPI.get_by_ids(ids);
            if (res) {
                setList(res.records)
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
                </div>
            ),
            key: '11'
        }
    ];

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

    const editPerson= (id) => {
        setPersonProfileVisible(true);
        setSelectedPerson(id);
    };

    const closeEditPerson = async () => {
        // getList(selectedSorter, dataSearch);
        getList(selectedSorter, dataSearch);
        setPersonProfileVisible(false);
        setSelectedPerson(null);
    };

    return (
        <Card>
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="font-weight-semibold">Danh sách sao chép nhiều</h2>
                    <Row type="flex" justify="center">
                        <Col sm={24} md={12} lg={8}>
                            <p>
                                Sao chép thành công {codes.length} bản ghi
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Space wrap>
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <Button type="primary"
                                style={{borderRadius: '0', background: '#666CFF'}}
                                className="rounded"
                                icon={<SettingOutlined/>}>
                        </Button>
                    </Dropdown>
                </Space>
            </div>
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
            <EditCopyPerson id={selectedPerson} visible={personProfileVisible} close={() => (closeEditPerson())}/>
        </Card>
    )
}

export default ViewMassCopy
