import React from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { itemDetails }  from '../types';

interface SHRDataTableProps {
    data: itemDetails[];
}

const SHRDataTable: React.FC<SHRDataTableProps> = ({ data }) => {
  const headers = ['Name', 'Value', 'Date Recorded'];

  return (
    <DataTable rows={data} headers={headers}>
      {({ rows, headers, getHeaderProps, getRowProps }) => (
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })}>{header}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow {...getRowProps({ row })}>
                <TableCell>{row?.name}</TableCell>
                <TableCell>{row?.value}</TableCell>
                <TableCell>{row?.dateRecorded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
};

export default SHRDataTable;
