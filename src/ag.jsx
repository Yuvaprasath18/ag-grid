import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Modal,
  Typography,
  Input,
  Form,
  message,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
ModuleRegistry.registerModules([AllCommunityModule]);

const AggridCrud = () => {
  const [rowData, setRowData] = useState([
    { name: "Yuva", deg: "Intern", regNo: 205 },
    { name: "Suresh", deg: "CEO", regNo: 195 },
    { name: "Jeeva", deg: "Manager", regNo: 123 },
  ]);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const columnDefs = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "deg", headerName: "Designation", flex: 1 },
      { field: "regNo", headerName: "Reg No", width: 100 },
      {
        headerName: "Actions",
        field: "actions",
        width: 120,
        cellRenderer: (params) => {
          return (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(params.data)}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(params.data.regNo)}
              />
            </Space>
          );
        },
      },
    ],
    [rowData]
  );

  const handleAddOrEdit = () => {
    form.validateFields().then((values) => {
      const newData = { ...values, regNo: Number(values.regNo) };
      const updated = [...rowData];

      const existingIndex = updated.findIndex(
        (item) => item.regNo === newData.regNo
      );

      if (editing !== null && existingIndex !== -1) {
        updated[existingIndex] = newData;
        message.success("User updated!");
      } else if (existingIndex !== -1) {
        message.error("Reg No already exists!");
        return;
      } else {
        updated.push(newData);
        message.success("User added!");
      }

      setRowData(updated);
      form.resetFields();
      setModal(false);
      setEditing(null);
    });
  };

  const handleEdit = (data) => {
    form.setFieldsValue(data);
    setEditing(data.regNo);
    setModal(true);
  };

  const handleDelete = (regNo) => {
    const updated = rowData.filter((item) => item.regNo !== regNo);
    setRowData(updated);
    message.success("User deleted");
  };

  return (
    <div className="select-none">
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Ag grid crud
      </Typography.Title>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Button type="primary" onClick={() => setModal(true)}>
          Add User
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} rowHeight={40} />
      </div>

      <Modal
        title={editing !== null ? "Edit User" : "Add User"}
        open={modal}
        onOk={handleAddOrEdit}
        onCancel={() => {
          setModal(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={editing !== null ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Designation"
            name="deg"
            rules={[{ required: true, message: "Please enter designation" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Reg No"
            name="regNo"
            rules={[{ required: true, message: "Please enter reg no" }]}
          >
            <Input type="number" disabled={editing !== null} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AggridCrud;
