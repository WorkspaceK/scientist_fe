import request, {apiFormData} from 'utils/request'
import { endPointAPI } from 'constants/endPointAPI'

const degreeService = () => {
    const getByPage = async (page, size, order, field, dataSearch) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET}`, {
                params: {
                    page: page,
                    size: size, /* size number / page */
                    order: order,
                    field: field,
                    name: dataSearch,
                    // code: dataSearch,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    const store = async (data) => {
        return await request.post(`/${endPointAPI.ADMIN.DEGREE.GET}`, data);
    };

    const getById = async (id) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}`);
            return response.data;
        } catch {
            return null;
        }
    };

    const update = async (id, dataPerson) => {
        return await request.patch(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}`, dataPerson);
    };

    const destroy = async (id) => {
        return await request.delete(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}`);
    };

    const massDelete = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.DEGREE.MASS_DELETE}`, ids);
            return res.data;
        } catch (error) {
            console.error('Error deleting multiple records:', error);
            return null;
        }
    };

    const copy = async (id) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}/copy`);
            return res.data;
        } catch  {
            return null;
        }
    };

    const massCopy = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.DEGREE.MASS_COPY}`, ids);
            return res.data;
        } catch  {
            return null;
        }
    }

    const getByIds = async (ids) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET_BY_ID}`, {
                params: {
                    ids,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    const getByCodes = async (codes) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET_BY_CODE}`, codes);
            return response.data;
        } catch {
            return null;
        }
    }

    const hasByCode = async (code) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET}/${code}/has-by-code`,);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByName= async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.DEGREE.GET}/${name}/has-by-name`);
            return res.data;
        } catch {
            return null;
        }
    }

    const searchByName = async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.DEGREE.SEARCH_BY_NAME}`, name);
            return res.data;
        } catch {
            return null;
        }
    }

    const upload = async (id, dataPerson) => {
        return await request.patch(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}/upload-avatar`, dataPerson);
    };

    const updateStatus = async (id, status) => {
        return await request.patch(`/${endPointAPI.ADMIN.DEGREE.GET}/${id}/update-status`,{ is_default: status}
        );
    };

    const importFile = async (data) => {
        const res = await apiFormData.post(`/${endPointAPI.ADMIN.DEGREE.IMPORT}`, data);
        return res.data;
    }

    const exportCSV = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.DEGREE.EXPORT_CSV}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    const massExport = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.DEGREE.EXPORT}`, {
                params: data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    };

    return {
        getByPage,
        store,
        getById,
        update,

        destroy,
        massDelete,

        copy,
        massCopy,

        getByIds,

        massExport,

        hasByCode,
        hasByName,
        upload,
        getByCodes,

        updateStatus,

        //
        importFile,
        exportCSV,

    };
};

export default degreeService;