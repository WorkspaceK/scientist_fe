export const endPointAPI = {
    ADMIN: {
        DEGREE: {
            GET: 'admins/degrees',
            MASS_DELETE: 'admins/degrees/delete',
            MASS_COPY: 'admins/degrees/copy',

            GET_BY_ID: 'admins/degrees/get-by-id',
            GET_BY_CODE: 'admins/degrees/get-by-code',
            HAS_BY_CODE: 'admins/degrees/has-by-code',
            IMPORT_EXCEL_DATA: 'admins/degrees/import-excel-data',
            EXPORT_CSV: 'admins/degrees/export-csv',
            EXPORT_XLSX: 'admins/degrees/export-xlsx',
        },
        PERSON: {
            GET: 'admins/persons',
            mass_delete: 'admins/persons/delete',
            mass_copy: 'admins/persons/copy',

            SHOW_PERSON_LIST_BY_ID: 'admins/persons/show-scientist-list-by-id',
            SHOW_PERSON_LIST_BY_CODE: 'admins/persons/show-scientist-list-by-code',
            HAS_BY_CODE: 'admins/persons/has-by-code',
            HAS_BY_NAME: 'admins/persons/has-by-name',
            HAS_STUDENT_LISTS: 'admins/persons/has-student-list',
            IMPORT_EXCEL_DATA: 'admins/persons/import-excel-data',
            EXPORT_CSV: 'admins/persons/export-csv',
            EXPORT_XLSX: 'admins/persons/export-xlsx',

            //recycle
            RECYCLE: 'admins/persons/recycle',
            RESTORE_MULTIPLE: 'admins/persons/restore-multiple',
            RESTORE_ALL: 'admins/persons/restore-all',
            FORCE_DELETE_MULTIPLE: 'admins/persons/force-delete-multiple',
            FORCE_DELETE_ALL: 'admins/persons/force-delete-all',
        },
        PUBLICATION: {
            GET_LIST: 'admins/publications',
            GET_PAGINATE: 'admins/publications/get-paginate',
            GET_LIST_SORT_ORDER: 'admins/publications/get-list-sort-order',
            SHOW_PUBLICATION_LIST_BY_ID: 'admins/publications/show-scientist-list-by-id',
            SHOW_PUBLICATION_LIST_BY_CODE: 'admins/publications/show-scientist-list-by-code',
            SEARCH: 'admins/publications/search',
            HAS_BY_CODE: 'admins/publications/has-by-code',
            HAS_BY_NAME: 'admins/publications/has-by-name',
            HAS_STUDENT_LISTS: 'admins/publications/has-student-list',

            STORE: 'admins/publications/store',
            UPDATE: 'admins/publications/update',
            DELETE_MULTIPLE: 'admins/publications/delete-multiple',
            RECORD_MULTIPLE: 'admins/publications/record-multiple',
            IMPORT_EXCEL_DATA: 'admins/publications/import-excel-data',
            EXPORT_CSV: 'admins/publications/export-csv',
            EXPORT_XLSX: 'admins/publications/export-xlsx',

            //recycle
            RECYCLE: 'admins/publications/recycle',
            RESTORE_MULTIPLE: 'admins/publications/restore-multiple',
            RESTORE_ALL: 'admins/publications/restore-all',
            FORCE_DELETE_MULTIPLE: 'admins/publications/force-delete-multiple',
            FORCE_DELETE_ALL: 'admins/publications/force-delete-all',
        },
    },
    DEGREE: 'degree',
    PERSON: 'persons',
    PUBLICATION: 'publication',
}


