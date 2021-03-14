import React from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect
} from 'react-table';
import Moment from 'moment';

import './table.scss';

const TableImage = (props) => {
	const {
		alt='',
		altImage={},
		className='',
		src='',
		srcType=''
	} = props;
	const srcArray = src ? [srcType, src] : (altImage.src ? [altImage.srcType, altImage.src] : []);
	const _src = srcArray.filter(s => s).join(',');

	return <img
		className={`tableImage ${className}`}
		src={_src}
		alt={alt}
	></img>
}

const Table = ({
	columns,
	data,
	className
}) => {
	const columnMapper = colArray => {
		return colArray.reduce((acc,colObj) => {
			const {header, field, template, columns, options} = colObj;
			
			const _colObj = {
				Header: header
			};

			let innerElement;

			switch(options && options.dataType) {
				case 'date':
					_colObj.id = field;
					_colObj.accessor = field;

					innerElement = d => {
						return Moment(d)
						.local()
						.format(options.dateFormat || "DD/MM/YYYY")
					}
					break;
				case 'image':
					const {srcType, altImage} = options;

					_colObj.id = field;
					_colObj.accessor = field;

					innerElement = d => {
						return <TableImage
							src={d}
							srcType={srcType}
							altImage={altImage}
							{...options.attr}
						></TableImage>
					}
					break;
				default:
					_colObj.accessor = field;
			}



			if(!innerElement) {
				innerElement = d => d;
			}

			_colObj.Cell = d => {
				const value = (d && d.row && d.row.original && d.row.original[field]) ? d.row.original[field] : '';
				return typeof template == 'function' ? template(innerElement(value)) : innerElement(value);
			};

			/* if(typeof template == 'function') {
				_colObj.Cell = d => template(innerElement(d));
			} else {
				_colObj.Cell = d => innerElement(d);
			} */

			/* if(innerElement) {
				if(typeof template == 'function') {
					_colObj.Cell = d => template(innerElement(d));
				} else {
					_colObj.Cell = innerElement;
				}
			} */

			//console.log(typeof template, template)

			/* if(typeof template == 'function') {
				//console.log(template)
				_colObj.Cell = props => innerElement
				_colObj.accessor = "";
				/-* React.createClass({
					render: template(innerElement)
				}); *-/
				/-*console.log(template(innerElement))
				_colObj.accessor = template(innerElement);*-/
			} else {
				_colObj.accessor = innerElement;
			} */

			if(columns && columns.length > 0)
				_colObj.columns = columnMapper(colObj.columns);
			
			return acc.concat(_colObj);
		},[]);
	};

	const _columns = columnMapper(columns);

	console.log(_columns)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({
		columns: _columns,
		data
	})

	return (  
		<table
			className={`table ${className}`}
			{...getTableProps()}
		>
			<thead>
				{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
					<th {...column.getHeaderProps()}>{column.render('Header')}</th>
					))}
				</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map(
				(row, i) => {
					prepareRow(row);
					return (
					<tr {...row.getRowProps()}>
						{row.cells.map(cell => {
							console.log(cell.getCellProps())
						return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
						})}
					</tr>
					)}
				)}
			</tbody>
		</table>
	);
};

var columnShape = function () {
	return PropTypes.shape({
		header: PropTypes.string.isRequired,
		field: PropTypes.string.isRequired,
		columns: PropTypes.arrayOf(columnShape)
	}).apply(this, arguments);
}

Table.propTypes = {
	columns: PropTypes.arrayOf(columnShape).isRequired,
	data: PropTypes.arrayOf(PropTypes.any).isRequired
}

Table.defaultProps = {
	columns: [],
	data: []
}

export default Table;