import {Form, Input, Button, Select, message, Row, Col, Drawer} from 'antd';
import {throttle} from 'lodash';
import React, {useEffect, useState} from 'react';
import DegreeService from 'services/categories/DegreeService';
import 'react-quill/dist/quill.snow.css';
import {useHistory} from "react-router-dom";

// const { Option } = Select;

const Edit = ({id, visible, close}) => {
    let history = useHistory();
    const [data, setData] = useState(null);
    const API = DegreeService();
    const [form] = Form.useForm();

    // const [value, setValue] = useState('');
    // const [action, setAction] = useState(null);
    //Event


    const fetchData = async (id) => {
        const response = await API.getById(id);
        setData(response);
        form.setFieldsValue(response);
        form.setFieldsValue({
            code: response.code,
            name: response.name,
            is_default: response.is_default,  // Chuyển đổi boolean thành chuỗi
        });
    }
    useEffect(() => {
        if(id) fetchData(id);
    }, [id]);

    // useEffect(() => {
    //     if (data) {
    //         form.setFieldsValue({
    //             code: data.code,
    //             name: data.name,
    //             is_default: data.is_default ? 'true' : 'false',  // Chuyển đổi boolean thành chuỗi
    //         });
    //     }
    // }, [data]);

    // console.log(data.code)

    const update = async (data) => {
        try {
            const res = await API.update(id, data);
            res.status === 200 ? message.success('Sửa thành công') : message.error('Sửa thất bại');
        } catch (error) {
            message.error('Error update class');
        }
    };

    const cancel = () => {
        history.push(`/app/managements/categories/degree/list`);
    };
    const throttledSearchByCode = throttle(async (value) => {
        return await API.hasByCode(value);
    }, 100);

    const throttledSearchByName = throttle(async (value) => {
        return await API.hasByName(value);
    }, 100);


    const rules = {
        code: [
            { required: true, message: 'Hãy nhập mã' },
            { max: 50, message: 'Mã không được vượt quá 50 ký tự' },
            {
                validator: async (_, value) => {
                    if (!value) {
                        return Promise.resolve();
                    }

                    // const exists = await debounceSearchByCode(value);
                    const exists = await throttledSearchByCode(value);
                    if (exists && value !== data.code) {
                        return Promise.reject(new Error('Mã đã tồn tại!'));
                    }
                    return Promise.resolve();
                }
            }
        ],
        name: [
            { required: true, message: 'Hãy nhập thông tin' },
            { max: 50, message: 'Tên không được vượt quá 50 ký tự' },
            {
                validator: async (_, value) => {
                    if (!value) {
                        return Promise.resolve();
                    }
                    const exists = await throttledSearchByName(value);
                    if (exists && value !== data.name) {
                        return Promise.reject(new Error('Mã đã tồn tại!'));
                    }
                    return Promise.resolve();
                }
            }
        ],
    };

    // const onCodeChange = async () => {
    //     try {
    //         await form.validateFields(['code']);
    //     } catch (error) {
    //         console.log('Validation Failed:', error);
    //     }
    // };

    return (
        <Drawer
            title="Edit Class"
            width={720}
            placement="right"
            onClose={close}
            closable={false}
            visible={visible}
            bodyStyle={{
                paddingBottom: 80,
            }}
        >
            <Form layout="vertical" form={form} name="control-hooks" onFinish={update}>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item name="code" label="Mã học vị" rules={rules.code}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item name="name" label="Tên học vị" rules={rules.name}>
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item name="is_default" label="Mặc định">
                            <Select className="w-100" placeholder="False"
                                    options={[
                                        { value: false, label: 'False' },
                                        { value: true, label: 'True' },
                                    ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item >
                    <Button className="mr-2" htmlType="submit" onClick={update} style={{background:'#666CFF', color: 'white'}}>
                        Chỉnh sửa
                    </Button>
                    <Button className="mr-2"  htmlType="button" onClick={cancel}>
                        Trở về danh sách
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default Edit