import {Form, Input, Button, Select, Card, message, Upload, Image, Row, Col, Avatar} from 'antd';
import {debounce, values, throttle} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import PersonService from 'services/PersonService';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Flex from 'components/shared-components/Flex'
import CustomIcon from "components/util-components/CustomIcon";
import { ImageSvg } from 'assets/svg/icon';
import Dragger from "antd/es/upload/Dragger";
import {useHistory, useLocation} from "react-router-dom";
import personService from "services/PersonService";

const { Option } = Select;

// Validator


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const CopyPerson = () => {
    let history = useHistory();
    const [dataPerson, setDataPerson] = useState(null);
    const [value, setValue] = useState('');
    const [action, setAction] = useState(null);
    //Event
    const personAPI = PersonService();
    const [form] = Form.useForm();

    const location = useLocation();
    const { res } = location.state || { res: [] };

    const fetchData = async () => {
        const response = await personAPI.show(res.id);
        setDataPerson(response);
        form.setFieldsValue(response);
    }
    useEffect(() => {
        if(res.id) fetchData();
    }, [res.id]);

    const update = async (data) => {
        try {
            const res = await personAPI.update(res.id, data);
            res ? message.success('Sửa thành công') : message.error('Sửa thất bại');
        } catch (error) {
            message.error('Error update class', error);
        }
    };
    const cancel = () => {
        history.push(`/app/managements/person/person-list`);
    };

    // const debounceSearchByCode =
    // 	debounce((value) => hasByCode(value), 500);

    const throttledSearchByIdentifi = throttle(async (value) => {
        return await personAPI.hasByIdentifi(value);
    }, 100);

    const throttledSearchByEmail = throttle(async (value) => {
        return await personAPI.hasByEmail(value);
    }, 100);


    const rules = {
        identification: [
            { required: true, message: 'Hãy nhập thông tin CCCD/CMND!' },
            { max: 50, message: 'CCCD/CMND không được vượt quá 50 ký tự' },
            {
                validator: async (_, value) => {
                    if (value === dataPerson.identification) {
                        return Promise.resolve();
                    } else {
                        const exists = await throttledSearchByIdentifi(value);
                        if (exists === true && value !== dataPerson.identification) {
                            return Promise.reject(new Error('CCCD/CMND đã tồn tại!'));
                        }
                        return Promise.resolve();
                    }
                }
            }
        ],
        first_name: [
            { required: true, message: 'Hãy nhập thông tin họ và đệm!' },
            { max: 50, message: 'Họ và tên đệm không được vượt quá 50 ký tự' },
        ],
        last_name: [
            { required: true, message: 'Hãy nhập thông tin họ và đệm!' },
            { max: 50, message: 'Họ và tên đệm không được vượt quá 50 ký tự' },
        ],
        email: [
            { required: true, message: 'Hãy nhập thông tin email' },
            { max: 100, message: 'Email không được vượt quá 100 ký tự' },
            {
                validator: async (_, value) => {
                    if (value === dataPerson.email) {
                        return Promise.resolve();
                    } else {
                        const exists = await throttledSearchByIdentifi(value);
                        if (exists === true && value !== dataPerson.email) {
                            return Promise.reject(new Error('Email đã tồn tại!'));
                        }
                        return Promise.resolve();
                    }
                }
            }
        ],
        phone_number: [
            { required: true, message: 'Hãy nhập thông tin số điện thoại' },
            { max: 20, message: 'Số điện thoại không được vượt quá 20 ký tự' },
        ],
        degree_id: [
            { required: true, message: 'Hãy nhập thông tin học vị!' },
        ],
    };

    const onCodeChange = async () => {
        try {
            await form.validateFields(['code']);
        } catch (error) {
            console.log('Validation Failed:', error);
        }
    };
    const avatarSize = 150;

    return (
        <Card>
            <Col span={12} offset={6}>
                <Form layout="vertical" form={form} name="control-hooks" onFinish={update}>
                    <Card>
                        <Row gutter={16}>
                            <Col sm={24} md={23}>
                                <div className="d-md-flex ">
                                    <div className="rounded bg-white shadow-sm mx-auto" style={{'maxWidth': `${avatarSize + 16}px`}}>
                                        <Avatar shape="square" size={avatarSize} src="/img/avatars/avatar-new.png" />
                                    </div>
                                    <div className="ml-md-4 w-100 align-self-center">
                                        <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
                                            <div className="ml-md-3 mt-3 mt-md-0">
                                                <Button size="small" style={{color:'#666CFF'}}>UPLOAD NEW PHOTO</Button>
                                                <Button size="small" className="ml-2"
                                                        style={{color:'#FF4D49'}}
                                                >RESET</Button>
                                            </div>
                                        </Flex>
                                        <Row gutter="16">
                                            <Col >
                                                <p className="mt-0 mr-3 text-muted text-md-left text-center">
                                                    Allowed JPG, GIF or PNG. Max size of 500K
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="identification" label="CCCD/CMND" rules={rules.identification}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="first_name" label="Họ và tên đệm" rules={rules.first_name} >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="last_name" label="Tên" rules={rules.last_name}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="phone_number" label="Số điện thoại" rules={rules.phone_number}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item name="email" label="Email" rules={rules.email}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="degree_id" label="Học vị" rules={rules.degree_id}>
                                <Select className="w-100" placeholder="Học vị"
                                        options={[
                                            {value: '1', label: 'ThS' },
                                            {value: '2', label: 'TS'},
                                        ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item name="academic_rank_id" label="Học hàm">
                                <Select className="w-100" placeholder="Học hàm" value={'N/A'}
                                        options={[
                                            {value: '1', label: 'PGS' },
                                            {value: '2', label: 'GS'},
                                        ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item >
                        <Button className="mr-2" htmlType="submit" style={{background:'#666CFF', color: 'white'}}>
                            Chỉnh sửa
                        </Button>
                        <Button className="mr-2"  htmlType="button" onClick={cancel}>
                            Trở về danh sách
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Card>
    );
};

export default CopyPerson