import React, { useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Dropdown,
    Menu,
    message,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Upload
} from "antd";
import {InboxOutlined, DeleteOutlined, ExportOutlined, SettingOutlined, FilterOutlined} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useHistory } from "react-router-dom";
import degreeService from "services/categories/DegreeService";
import utils from "../../../../../utils";
import Flex from "../../../../../components/shared-components/Flex";

const { Dragger } = Upload;

const Import = () => {
    const history = useHistory();
    const API = degreeService();
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [importSuccess, setImportSuccess] = useState(false); // Trạng thái để theo dõi việc import thành công

    // Cột trong bảng
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

    // Xử lý upload tệp
    const props = {
        name: "file",
        multiple: false,
        beforeUpload(file) {
            const isExcel =
                file.type === "application/vnd.ms-excel" ||
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (!isExcel) {
                message.error("You can only upload Excel files!");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error("File must be smaller than 2MB!");
                return false;
            }
            setFile(file); // Lưu tệp
            readExcel(file); // Đọc và hiển thị dữ liệu
            return false;
        },
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove() {
            // Khi người dùng xóa tệp, reset lại dữ liệu và file
            setFile(null);
            setData([]);
            setImportSuccess(false); // Đặt lại trạng thái import thành công khi xóa tệp
        },
    };

    // Đọc dữ liệu từ tệp Excel
    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Lọc dữ liệu nếu cần
            const filteredData = jsonData.filter((row) => row[0] !== "Mã học vị" && row[0] !== null);

            // Cập nhật dữ liệu hiển thị
            const formattedData = filteredData.map((row, index) => ({
                key: index,
                code: row[0], // Mã học vị
                name: row[1], // Tên học vị
                description: row[2], // Mô tả
                default: row[3] === "True", // Mặc định
            }));

            setData(formattedData);
        };
        reader.readAsBinaryString(file);
    };

    // Xóa dữ liệu trong bảng
    const deleteItem = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
    };

    // Upload dữ liệu khi nhấn nút Upload
    const handleUploadClick = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("data", JSON.stringify(data)); // Gửi dữ liệu đã chỉnh sửa lên server
            const fileData = await API.importFile(formData);
            if (fileData) {
                setImportSuccess(true); // Đánh dấu việc import thành công
                message.success("Import thành công");
            } else {
                message.error("Import thất bại");
            }
        } catch (e) {
            console.error("Error during file upload:", e);
            message.error("Import thất bại");
        }
    };

    // Quay lại danh sách
    const cancel = () => {
        history.push(`/app/managements/categories/degree/list`);
    };

    return (
    <Card>
        <div className="text-center mb-4">
            <h2 className="font-weight-semibold">Import dữ liệu</h2>
            <p>Chọn mẫu hoặc file import</p>
            <br/>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            <br/>
            {/* Chỉ hiển thị thông báo nếu import thành công */}
            {importSuccess && (
                <Row type="flex" justify="center">
                    <Col sm={24} md={12} lg={8}>
                        <p>Import thành công {data.length} bản ghi</p>
                    </Col>
                </Row>
            )}
        </div>
        <Card>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Button type="primary" onClick={handleUploadClick} style={{marginTop: 16}}>
                    Upload
                </Button>
                <Flex className="mb-1" mobileFlex={false}>
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
                    dataSource={data}
                    rowKey='id'
                />
            </div>
        </Card>
        <div className="d-flex justify-content-end mb-4">
            <Button type="primary" onClick={cancel} style={{marginTop: 16}}>
                Trở về danh sách
            </Button>
        </div>
    </Card>
    );
};

export default Import;
