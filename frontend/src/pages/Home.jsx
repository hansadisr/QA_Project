import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getToken, setToken } from '../api';

export default function Home() {
  const nav = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/api/tasks');
      setTasks(data);
    } 
    catch (e) {
  // 1. Log the error for debugging purposes
  console.error('Error loading tasks:', e); 
  
  // 2. Set the user-facing error message (as you already were)
  setErr('Could not load tasks. Are you logged in?');
}
  };

  const add = async () => {
    if (!newTask.trim()) return;
    try {
      await api.post('/api/tasks', { title: newTask });
      setNewTask('');
      load();
    } 
    catch (e) {
  // Log the error for debugging
  console.error('Task addition failed:', e); 
  
  // Set the user-facing error message
  setErr('Failed to add task');
}
  };

  useEffect(() => {
    const t = getToken();
    if (!t) { nav('/login'); return; }
    setToken(t);
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{maxWidth:520, margin:'40px auto', fontFamily:'system-ui'}}>
      <h2>Tasks</h2>
      {err && <div style={{color:'crimson', marginBottom:8}}>{err}</div>}
      <div style={{display:'flex', gap:8}}>
        <input
          id="taskInput"
          placeholder="New task..."
          value={newTask}
          onChange={e=>setNewTask(e.target.value)}
          style={{flex:1, padding:8}}
          data-testid="task-input"

        />
        <button id="addTaskBtn" onClick={add}data-testid="add-task">Add</button>
      </div>
      <ul id="taskList">
        {tasks.map(t => <li key={t._id} data-testid="task-item">{t.title}</li>)}
      </ul>
    </div>
  );
}
