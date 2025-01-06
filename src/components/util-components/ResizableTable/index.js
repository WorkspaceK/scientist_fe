import React, { useState } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }
    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => e.stopPropagation()}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

const ResizableTable = ({
                            columns,
                            dataSource,
                            rowKey,
                            loading,
                            rowSelection,
                            pagination,
                            onChange,
                            rowClassName,
                        }) => {
    const [resizableColumns, setResizableColumns] = useState(
        columns.map((col, index) => ({
            ...col,
            onHeaderCell: (column) => ({
                width: column.width,
                onResize: handleResize(index),
            }),
        }))
    );

    const handleResize = (index) => (e, { size }) => {
        setResizableColumns((prevColumns) => {
            const nextColumns = [...prevColumns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return nextColumns;
        });
    };

    const components = {
        header: {
            cell: ResizableTitle,
        },
    };

    return (
        <Table
            components={components}
            columns={resizableColumns}
            dataSource={dataSource}
            rowKey={rowKey}
            loading={loading}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onChange}
            rowClassName={rowClassName}
        />
    );
};

export default ResizableTable;
