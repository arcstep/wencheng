import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const ProjectView = ({ handleChangeView }) => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project1', description: 'This is project 1' },
    { id: 2, name: 'Project2', description: 'This is project 2' },
    // ...
  ]);

  const handleAdd = () => {
    // 添加项目
  };

  const handleDelete = (id) => {
    // 删除项目
  };

  const handleUpdate = (id) => {
    // 更新项目
  };

  const handleWrite = (id) => {
    // 切换项目
    handleChangeView(2)
  }

  return (
    <div>
      <Button onClick={handleAdd}>创建新项目</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>项目名称</TableCell>
              <TableCell>项目描述</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Button onClick={() => handleWrite(project.id)}>切换</Button>
                  <Button onClick={() => handleUpdate(project.id)}>修改</Button>
                  <Button onClick={() => handleDelete(project.id)}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectView;