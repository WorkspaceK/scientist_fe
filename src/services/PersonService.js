import request, {apiFormData} from 'utils/request'
import { endPointAPI } from 'constants/endPointAPI'

const personService = () => {
    const getListPerson = async (currentPage, pageSize, sortOrder, field, dataSearch) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}`, {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    sortOrder: sortOrder,
                    field: field,
                    last_name: dataSearch,
                    // code: dataSearch,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    const search = async (dataSearch) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.PERSON.SEARCH}`, {
                params: {
                    // identification: dataSearch,
                    // first_name: dataSearch,
                    last_name: dataSearch,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    // const getListPersonPaginate = async (currentPage, pageSize, dataSearch) => {
    //     try {
    //         const response = await request.get(`${endPointAPI.ADMIN.PERSON.GET_LIST}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 name: dataSearch,
    //                 // code: dataSearch,
    //             }
    //         });
    //         return response.data;
    //     } catch {
    //         return null;
    //     }
    // }
    //
    // const search = async (currentPage, pageSize, dataSearch) => {
    //     try {
    //         const res = await request.get(`${endPointAPI.ADMIN.PERSON.SEARCH}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 code: dataSearch,
    //                 name: dataSearch,
    //                 mentor: dataSearch,
    //             },
    //         });
    //         return res.data
    //     } catch  {
    //         return null;
    //     }
    // }
    //
    // const getListSortOrder = async (currentPage, pageSize, sortOrder, field) => {
    //     try {
    //         const response = await request.get(`${endPointAPI.ADMIN.PERSON.GET_LIST_SORT_ORDER}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 sortOrder: sortOrder,
    //                 field: field
    //             }
    //         });
    //         return response.data;
    //     } catch {
    //         return null;
    //     }
    // }

    const show = async (id) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/show`);
            return response.data;
        } catch {
            return null;
        }
    };

    const showPersonListById = async (ids) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.PERSON.SHOW_PERSON_LIST_BY_ID}`, ids);
            return response.data;
        } catch {
            return null;
        }
    }

    const showPersonListByCode = async (currentPage, pageSize, sortOrder, field, dataSearch, codes) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.PERSON.SHOW_PERSON_LIST_BY_CODE}`,{
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    sortOrder: sortOrder,
                    field: field,
                    name: dataSearch,
                    codes,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    }

    const showStudentList = async (id) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/student/show-student-list`);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasStudentList = async () => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.HAS_PERSON_LISTS}`);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByCode = async (code) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${code}/has-by-code`,);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByName= async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${name}/has-by-name`);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByIdentifi = async (identification) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${identification}/has-by-identifi`);
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const hasByEmail = async (email) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${email}/has-by-email`);
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const searchByName = async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.PERSON.SEARCH_BY_NAME}`, name);
            return res.data;
        } catch {
            return null;
        }
    }

    const store = async (data) => {
        return await request.post(`/${endPointAPI.ADMIN.PERSON.STORE}`, data);
    };

    const upload = async (id, dataPerson) => {
        return await request.patch(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/upload-avatar`, dataPerson);
    };

    const update = async (id, dataPerson) => {
        return await request.patch(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/update`, dataPerson);
    };

    const updateStatus = async (id, status) => {
        return await request.patch(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/update-status`,{ status: status}
        );
    };

    const deletePerson = async (id) => {
        return await request.delete(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/delete`);
    };

    const deleteMultiple = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.PERSON.DELETE_MULTIPLE}`, ids);
            return res.data;
        } catch (error) {
            console.error('Error deleting multiple records:', error);
            return null;
        }
    };

    const record = async (id) => {
        try {
            return await request.post(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/record`);
        } catch  {
            return null;
        }
    };

    const recordMultiple = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.PERSON.RECORD_MULTIPLE}`, ids);
            return res.data;
        } catch  {
            return null;
        }
    }

    const importPerson = async (data) => {
        try {
            const res = await apiFormData.post(`/${endPointAPI.ADMIN.PERSON.IMPORT_EXCEL_DATA}`, data);
            return res.data;
        } catch (error){
            console.error('There was an error upload the file!', error);
            return null;
        }
    }

    const exportCSV = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.PERSON.EXPORT_CSV}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    const exportXLSX = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.PERSON.EXPORT_XLSX}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    //recycle
    const recycle = async (currentPage, pageSize, value) => {
        try {
            const response = await request.
            get(`${endPointAPI.ADMIN.PERSON.RECYCLE}?page=${currentPage}&pageSize=${pageSize}`, {
                params: {
                    name: value
                }
            });
            return response.data;
        } catch  {
            return null;
        }
    }

    const showRecycled = async (id) => {
        try {
            const response = await request.
            get(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/show-recycled`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const restore = async (id) => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/restore`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const restoreMultiple = async (ids) => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.PERSON.RESTORE_MULTIPLE}`, ids);
        } catch  {
            return null;
        }
    }

    const restoreAll = async () => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.PERSON.RESTORE_ALL}`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const forceDelete = async (id) => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.PERSON.GET_LIST}/${id}/force-delete`);
            return response.data;
        } catch {
            return null;
        }
    }

    const forceDeleteMultiple = async (ids) => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.PERSON.FORCE_DELETE_MULTIPLE}`, ids);
            return response.data;
        } catch  {
            return null;
        }
    }

    const forceDeleteAll = async () => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.PERSON.FORCE_DELETE_ALL}`);
            return response.data;
        } catch  {
            return null;
        }
    }

    return {
        getListPerson,
        search,
        // getListPersonPaginate,
        // getListSortOrder,
        show,
        hasByCode,
        hasByName,
        hasByIdentifi,
        hasByEmail,

        store,
        upload,
        showPersonListById,
        showPersonListByCode,
        showStudentList,
        update,
        updateStatus,
        deletePerson,
        record,
        recordMultiple,
        deleteMultiple,

        //
        importPerson,
        exportCSV,
        exportXLSX,
        // search,

        //recycle
        recycle,
        restore,
        restoreMultiple,
        restoreAll,
        forceDelete,
        forceDeleteMultiple,
        forceDeleteAll,
    };
};

export default personService;