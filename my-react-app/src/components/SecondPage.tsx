import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Collapse, List, ListItem, ListItemText } from '@mui/material';

interface Student {
  userId: number;
  id: number;
  title: string;
  body: string;
  department: string;
  sub_departments?: string[];
}

const SecondPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [expandedSubDepartment, setExpandedSubDepartment] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/src/Students.json');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'User ID', width: 100 },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'body', headerName: 'Body', width: 400 },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
      renderCell: (params: GridCellParams) => {
        const department = params.value as string;
        const isExpanded = params.id === expandedRowId;
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => handleDepartmentClick(params.id)}>
            {department} {isExpanded ? '(-)' : '(+)'}
          </div>
        );
      },
    },
    {
      field: 'sub_departments',
      headerName: 'Sub-Departments',
      width: 200,
      renderCell: (params: GridCellParams) => {
        const subDepartments = params.value as string[];
        return (
          <Collapse in={params.id === expandedRowId}>
            <List>
              {subDepartments?.map((subDept, index) => (
                <ListItem key={index}>
                  <ListItemText primary={subDept} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        );
      },
    },
  ];

  const handleDepartmentClick = (rowId: number) => {
    setExpandedRowId((prevId) => (prevId === rowId ? null : rowId));
    setExpandedSubDepartment(null); // Reset expanded sub-department on department click
  };

  const handleSubDepartmentClick = (subDepartment: string) => {
    setExpandedSubDepartment((prevSubDepartment) => (prevSubDepartment === subDepartment ? null : subDepartment));
  };

  const isRowExpanded = (params: any) => params.id === expandedRowId;

  return (
    <div style={{ height: 550, width: '70%' }}>
      <DataGrid
        rows={students}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        isRowExpandable={(params) => !!params.row.sub_departments && params.row.sub_departments.length > 0}
        isRowExpanded={isRowExpanded}
        onRowClick={(params) => handleDepartmentClick(params.id)}
        onCellClick={(params) => {
          const fieldName = params.field;
          if (fieldName === 'sub_departments') {
            handleSubDepartmentClick(params.row.sub_departments![params.field]);
          }
        }}
      />
    </div>
  );
};

export default SecondPage;
