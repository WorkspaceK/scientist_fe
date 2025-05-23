import {Form, Input, Button, Select, Card, message, Upload, Image, Row, Col, Avatar} from 'antd';
import {debounce, values, throttle} from 'lodash';
import React, {useCallback, useState} from 'react';
import PublicationService from 'services/PublicationService';
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


const AddPublication = () => {
	let history = useHistory();
	const [value, setValue] = useState('');
	const [action, setAction] = useState(null);
	//Event
	const publicationAPI = PublicationService();
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
			const res = await publicationAPI.store(formData);
			if (res.status === 200) {
				message.success('Thêm mới thành công');
				if (action === 'goToList') {
					history.push(`/app/managements/publication/publication-list`);
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
		history.push(`/app/managements/publication/publication-list`);
	};

	// const debounceSearchByCode =
	// 	debounce((value) => hasByCode(value), 500);

	const throttledSearchByIdentifi = throttle(async (value) => {
		return await publicationAPI.hasByIdentifi(value);
	}, 100);

	const throttledSearchByEmail = throttle(async (value) => {
		return await publicationAPI.hasByEmail(value);
	}, 100);


	const rules = {
		identification: [
			{ required: true, message: 'Hãy nhập thông tin CCCD/CMND!' },
			{ max: 50, message: 'CCCD/CMND không được vượt quá 50 ký tự' },
			{
				validator: async (_, value) => {
					if (!value) {
						return Promise.resolve();
					}

					// const exists = await debounceSearchByCode(value);
					const exists = await throttledSearchByIdentifi(value);
					if (exists) {
						return Promise.reject(new Error('CCCD/CMND đã tồn tại!'));
					}
					return Promise.resolve();
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
					if (!value) {
						return Promise.resolve();
					}

					const exists = await throttledSearchByEmail(value);
					if (exists === true) {
						return Promise.reject(new Error('Email đã tồn tại!'));
					}
					return Promise.resolve();
				}
			}
		],
		phone_number: [
			{ required: true, message: 'Hãy nhập thông tin số điện thoại' },
			{ max: 20, message: 'Số điện thoại không được vượt quá 20 ký tự' },
			// {
			// 	validator: async (_, value) => {
			// 		if (!value) {
			// 			return Promise.resolve();
			// 		}
			//
			// 		const exists = await throttledSearchByName(value);
			// 		if (exists === true) {
			// 			return Promise.reject(new Error('Số điện thoại đã tồn tại!'));
			// 		}
			// 		return Promise.resolve();
			// 	}
			// }
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
			<Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="id" label="Mã đề tài" rules={rules.id}>
							<Input/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Tên đề tài" rules={rules.name}>
							<Input/>
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="descatiption" label="Mô tả" rules={rules.descatiption}>
							<Input />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="publication_type_id" label="Loại ấn phẩm" rules={rules.publication_type_id}>
							<Select className="w-100" placeholder="Loại ấn phẩm"
									options={[
										{value: '1', label: 'Tạp chí' },
										{value: '2', label: 'Hội thảo'},
									]}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name="ISSN" label="Mã ISSN" rules={rules.ISSN}>
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

export default AddPublication