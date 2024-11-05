// App.js
import React, { useState, useEffect } from 'react';
import { Layout, Card, Input, Button, List, Select, Modal, Badge, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import CustomCursor from './CustomCursor';

const { Header, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [filter, setFilter] = useState('all');

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') {
      message.warning('لطفا متن وظیفه را وارد کنید');
      return;
    }

    const newTaskObj = {
      id: Date.now(),
      content: newTask,
      priority: selectedPriority,
      category: selectedCategory,
      completed: false,
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    message.success('وظیفه جدید اضافه شد');
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    message.success('وظیفه حذف شد');
  };

  const editTask = (task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleEditSave = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setIsModalVisible(false);
    message.success('وظیفه ویرایش شد');
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (filter === 'high' || filter === 'medium' || filter === 'low') return task.priority === filter;
    return task.category === filter;
  });

  return (
    <Layout className="layout">
      <CustomCursor />
      <Header className="header">
        <h1 style={{ color: 'white' }}>لیست وظایف</h1>
      </Header>
      <Content className="content">
        <Card>
          <div className="add-task-container">
            <Input
              placeholder="وظیفه جدید"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onPressEnter={addTask}
            />
            <Select 
              defaultValue="medium"
              style={{ width: 120, margin: '0 8px' }}
              onChange={setSelectedPriority}
            >
              <Option value="high">اولویت بالا</Option>
              <Option value="medium">اولویت متوسط</Option>
              <Option value="low">اولویت پایین</Option>
            </Select>
            <Select
              defaultValue="general"
              style={{ width: 120, margin: '0 8px' }}
              onChange={setSelectedCategory}
            >
              <Option value="general">عمومی</Option>
              <Option value="work">کاری</Option>
              <Option value="personal">شخصی</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addTask}
            >
              افزودن
            </Button>
          </div>

          <div className="filters">
            <Select
              defaultValue="all"
              style={{ width: 200, marginTop: 16 }}
              onChange={setFilter}
            >
              <Option value="all">همه</Option>
              <Option value="completed">تکمیل شده</Option>
              <Option value="active">فعال</Option>
              <Option value="high">اولویت بالا</Option>
              <Option value="medium">اولویت متوسط</Option>
              <Option value="low">اولویت پایین</Option>
              <Option value="work">کاری</Option>
              <Option value="personal">شخصی</Option>
            </Select>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="task-list"
                  dataSource={filteredTasks}
                  renderItem={(task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <List.Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-item ${task.completed ? 'completed' : ''}`}
                          actions={[
                            <Button
                              icon={<CheckOutlined />}
                              onClick={() => toggleComplete(task.id)}
                              type={task.completed ? 'primary' : 'default'}
                            />,
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => editTask(task)}
                            />,
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => deleteTask(task.id)}
                            />
                          ]}
                        >
                          <Badge
                            color={getPriorityColor(task.priority)}
                            text={
                              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.content}
                              </span>
                            }
                          />
                          <span className="task-category">{task.category}</span>
                        </List.Item>
                      )}
                    </Draggable>
                  )}
                >
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <Modal
          title="ویرایش وظیفه"
          visible={isModalVisible}
          onOk={handleEditSave}
          onCancel={() => setIsModalVisible(false)}
        >
          <Input
            value={editingTask?.content}
            onChange={(e) => setEditingTask({ ...editingTask, content: e.target.value })}
          />
          <Select
            value={editingTask?.priority}
            style={{ width: '100%', marginTop: 16 }}
            onChange={(value) => setEditingTask({ ...editingTask, priority: value })}
          >
            <Option value="high">اولویت بالا</Option>
            <Option value="medium">اولویت متوسط</Option>
            <Option value="low">اولویت پایین</Option>
          </Select>
          <Select
            value={editingTask?.category}
            style={{ width: '100%', marginTop: 16 }}
            onChange={(value) => setEditingTask({ ...editingTask, category: value })}
          >
            <Option value="general">عمومی</Option>
            <Option value="work">کاری</Option>
            <Option value="personal">شخصی</Option>
          </Select>
        </Modal>
      </Content>
    </Layout>

  );
};

export default App;