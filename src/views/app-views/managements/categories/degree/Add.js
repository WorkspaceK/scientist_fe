import {Form, Input, Button, Select, Card, message, Upload, Image, Row, Col, Avatar} from 'antd';
import {debounce, values, throttle} from 'lodash';
import React, {useCallback, useState} from 'react';
import DegreeService from 'services/categories/DegreeService';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Flex from 'components/shared-components/Flex'
import CustomIcon from "components/util-components/CustomIcon";
import { ImageSvg } from 'assets/svg/icon';
import Dragger from "antd/es/upload/Dragger";
import {useHistory} from "react-router-dom";

const { Option } = Select;

// Validator


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const Add = () => {
	let history = useHistory();
	const [value, setValue] = useState('');
	const [action, setAction] = useState(null);
	//Event
	const API = DegreeService();
	const [form] = Form.useForm();
	const [avatarFile, setAvatarFile] = useState(null);

	const onFinish = async (data) => {
		const formData = new FormData();

		// Thêm các thông tin từ form vào formData
		Object.keys(data).forEach(key => {
			formData.append(key, data[key]);
		});

		// Nếu có avatar mới, thêm vào formData
		if (avatarFile) {
			formData.append('avatar', avatarFile);
		}
		try {
			const res = await API.store(formData);
			if (res.status === 200) {
				message.success('Thêm mới thành công');
				if (action === 'goToList') {
					history.push(`/app/managements/category/degree/list`);
				} else if (action === 'stay') {
					form.resetFields();
				}
			} else {
				message.error('Thêm mới thât bại');
			}
		} catch (error) {
		  // message.error('Thêm mới thất bại2', error);
		}
	  };
	const create = () => setAction('goToList');
	const create_and_continue = () => setAction('stay');

	const handleUpload = ({ file }) => {
		// Lưu avatar file vào state
		setAvatarFile(file);
	};

	const cancel = () => {
		history.push(`/app/managements/category/degree/list`);
	};

	// const debounceSearchByCode =
	// 	debounce((value) => hasByCode(value), 500);

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
					if (exists) {
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
					if (exists) {
						return Promise.reject(new Error('Mã đã tồn tại!'));
					}
					return Promise.resolve();
				}
			}
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
			<Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>
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
							<Select className="w-100" placeholder="False" defaultValue="false"
									options={[
										{ value: 'false', label: 'False' },
										{ value: 'true', label: 'True' },
									]}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item >
					<Button className="mr-2" htmlType="submit" onClick={create} style={{background:'#666CFF', color: 'white'}}>
						Thêm mới
					</Button>
					<Button className="mr-2" htmlType="submit" onClick={create_and_continue} style={{background:'#66D1FF', color: 'white'}}>
						Thêm mới và tiếp tục
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

export default Add