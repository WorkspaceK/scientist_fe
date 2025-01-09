import React, {useEffect, useState} from "react";
import {
    Button,
    Card, Checkbox,
    Col,
    Dropdown,
    Input, Menu,
    message,
    Pagination, Popconfirm,
    Row,
    Select,
    Space,
    Table, Tag,
    Tooltip,
    Upload
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    FileExcelOutlined, FileTextOutlined, SettingOutlined, FilterOutlined
} from "@ant-design/icons";
import {useHistory, useLocation} from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import {endPointAPI} from "constants/endPointAPI";
import Flex from "components/shared-components/Flex";
import degreeService from "services/categories/DegreeService";
import Edit from "./Edit";
const { Dragger } = Upload;

const { Title, Text } = Typography;

const { Option } = Select

const ExportScientist = () => {
    let history = useHistory();
    const API = degreeService();
    const [list, setList] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [loading, setLoading] = useState(false);


    const location = useLocation();
    const { data } = location.state || { data: [] };

    useEffect(() => {
        if (data && data.length > 0) {
            setList(data);
        }
    }, []);

    //export
    const exportCSV = async () => {
        try {
            const dataExport = selectedRowKeys;
            const fileData = await API.exportCSV(dataExport);

            if (fileData) {
                const url = window.URL.createObjectURL(new Blob([fileData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'class.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export class error');
        }
    }

    const exportXLSX = async () => {
        try {
            const dataExport = { points: selectedRowKeys }; // Wrap data for consistency with the BE request

            const response = await API.massExport(dataExport);

            if (response) {
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Degree.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
                message.error('No data to export');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export error. Please try again.');
        }
    };


    const action = [
        { label: '.csv', icon: <FileExcelOutlined />, event:  exportCSV },
        { label: '.xlsx', icon: <FileExcelOutlined />, event: exportXLSX },
        { label: '.json', icon: <FileTextOutlined />, event: () => console.log('file .json') },
    ];

    const [selectedAction, setSelectedAction] = useState(null);

    const handleSelectChange = (value) => {
        const actionItem = action.find(act => act.label === value);
        setSelectedAction(actionItem);
    };

    const handleButtonClick = () => {
        if (selectedAction && selectedAction.event) {
            selectedAction.event();
        } else {
            message.info('No action selected')
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
                    <Tag className="text-capitalize" color={is_default ? 'cyan' : 'red'}>
                        {is_default ? 'True' : 'False'}
                    </Tag>
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
                            // className="mr-2 border-0"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteItem(elm.key)}
                            size="small"
                        />
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
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    }

    const props = {
        name: "file",
        multiple: false,
        action: process.env.REACT_APP_API_URL + endPointAPI.ADMIN.DEGREE.EXPORT_XLSX,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const deleteItem = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setList(newData);
    };

    const massDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setList(newData);
    };

    const cancel = () => {
        history.push(`/app/managements/categories/degree/list`);
    };

    return (
        <Card>
            <div className="text-center mb-4">
                <h2 className="font-weight-semibold">Export dữ liệu</h2>
                <p>Chọn mẫu dữ liệu phù hợp</p>
            </div>
            <Card>
                <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                    <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                        <div className="mr-md-3">
                            <Button
                                onClick={massDelete}
                                style={{borderColor: 'red', color: 'red'}}
                            >
                                Xóa dữ liệu đã chọn</Button>
                        </div>
                    </Flex>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                            <Select
                                defaultValue="Select"
                                className="w-100"
                                style={{minWidth: 120}}
                                onChange={handleSelectChange}
                            >
                                <Option value="Select">Select</Option>
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
                            <Button onClick={handleButtonClick} type="primary" icon={<ExportOutlined/>}>
                                Export
                            </Button>
                        </div>
                        <div className="mr-md-3">
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
                        // loading={loading}
                        rowSelection={{
                            selectedRowKeys,
                            type: 'checkbox',
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                        }}
                    />
                </div>
            </Card>
            <div className="d-flex justify-content-end mb-4">
                <Button type="primary" onClick={cancel} style={{marginTop: 16}}>
                    Trở về danh sách
                </Button>
            </div>
        </Card>
    )
}

export default ExportScientist;