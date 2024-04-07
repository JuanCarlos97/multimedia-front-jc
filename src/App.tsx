import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Users from './views/Users';
import Login from './views/Login';
import Register from './views/Register';
import Layout from './views/Layout';
import Contents from './views/contents/Index';
import ShowContent from './views/contents/Show';
import CreateContent from './views/contents/Create';
import EditContent from './views/contents/Edit';
import Themes from './views/themes/Index';
import CreateTheme from './views/themes/Create';
import ShowTheme from './views/themes/Show';
import EditTheme from './views/themes/Edit';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Contents />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contents" element={<Contents />} />
          <Route path="/content/:id" element={<ShowContent />} />
          <Route path="/contents/new" element={<CreateContent />} />
          <Route path="/content/:id/edit" element={<EditContent />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/themes/new" element={<CreateTheme />} />
          <Route path="/theme/:id" element={<ShowTheme />} />
          <Route path="/theme/:id/edit" element={<EditTheme />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
