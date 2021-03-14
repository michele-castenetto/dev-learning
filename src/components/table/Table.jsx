import React from 'react';
import { useTable, useExpanded, useFilters } from 'react-table';


import './Table.scss';



let GridPrice = ({ cell }) => {
    return (
        <span className="grid_block table_price">
            {/* {formatPrezzo(cell.value)} */}
            {cell.value}
        </span>
    )
}


let GridNumber = ({ cell }) => {
    return (
        <span className="grid_block table_price">
            {cell.value}
        </span>
    )
}


let GridCell = ({ cell }) => {
    return (
        <span className="grid_block">
            {cell.value}
        </span>
    )
}


let GridDate = ({ cell }) => {
    return (
        <span className="grid_block">
            {/* {cell.value && Moment(cell.value).local().format("DD/MM/YYYY")} */}
            {cell.value}
        </span>
    )
}


let GridCurrency = ({ cell }) => {
    return (
        <span className="grid_block">
            {cell.value ? "€ " + parseFloat(cell.value).toFixed(2) : ""}
        </span>
    )
}


// ##TODO da tradurre "Search"
// Define a default UI for filtering
function GridFilter({ column: { filterValue, preFilteredRows, setFilter, placeholder } }) {

    return (
        <div className="column_filter_wrap">
            <input
                type="text"
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={placeholder || "Search"}
            />
            <span className="notranslate material-icons">search</span>
        </div>
    )
}


function Table({ columns, data, renderRowSubComponent }) {

    // ##OLD
    // let tableColumns = columns.map((col) => {
    //     let Cell = GridCell;
    //     let name = col.Cell;
    //     switch (col.Cell) {
    //         case "GridDate":
    //             col.Cell = GridDate;
    //             break;
    //         case "GridPrice":
    //             col.Cell = GridPrice;
    //             break;
    //         case "GridNumber":
    //             col.Cell = GridNumber;
    //             break;
    //         case "GridCell":
    //             col.Cell = GridCell;
    //             break;
    //         case "GridCurrency":
    //             col.Cell = GridCurrency;
    //             break;
    //     }
    //     return col;
    // });
    let tableColumns = columns;


    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: GridFilter,
        }),
        []
    )
    
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        flatColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { expanded }
    } = useTable({
        columns: tableColumns,
        data: data,
        defaultColumn: defaultColumn, // Be sure to pass the defaultColumn option
    },
        useFilters,
        useExpanded // We can useExpanded to track the expanded state
    )

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                                <div className="column_filter">{column.canFilter === true ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>

                {
                    rows.map( (row, i) => {
                        prepareRow(row);
                        return (
                            <tr key={i}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    )
                                })}
                            </tr>
                        );
                    })


                }

                {/* {rows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (

                            <React.Fragment {...row.getRowProps()}>
                                <tr>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>

                                {row.isExpanded ? (
                                    <tr>
                                        <td colSpan={flatColumns.length}>
                                            {renderRowSubComponent({ row })}
                                        </td>
                                    </tr>
                                ) : null}

                            </React.Fragment>

                        )
                    }
                )} */}


            </tbody>
        </table>
    )
}


const TableComp = ({ columns, rows, renderRowSubComponent }) => {
    return (
        <Table
            renderRowSubComponent={renderRowSubComponent}
            columns={columns}
            data={rows} 
        />
    )
};



export default TableComp;
export { TableComp as Table };
export { GridPrice };
export { GridNumber };
export { GridCell };
export { GridDate };
export { GridCurrency };
