import { useEffect, useState } from 'react';
import { Search, MapPin, CalendarDays, Plus, LogIn, LogOut, PackageSearch, Heart, X, User } from 'lucide-react';
import api from './utils/api';

const emptyForm = {
  type: 'lost',
  title: '',
  category: 'Electronics',
  description: '',
  location: '',
  contact: '',
  date: new Date().toISOString().slice(0, 10)
};

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showForm, setShowForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [auth, setAuth] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function loadItems() {
    try {
      const response = await api.get('/items', {
        params: { type: filter === 'all' ? '' : filter, search }
      });
      setItems(response.data.items);
    } catch {
      setMessage('Could not connect to the server. Please try again.');
    }
  }

  useEffect(() => { loadItems(); }, [filter, search]);

  useEffect(() => {
    async function loadUser() {
      if (!token) return;
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('token');
        setToken('');
      }
    }
    loadUser();
  }, [token]);

  async function submitAuth(event) {
    event.preventDefault();
    try {
      const url = authMode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(url, auth);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setShowAuth(false);
      setAuth({ name: '', email: '', password: '' });
      setMessage('Welcome, ' + response.data.user.name + '!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Please try again.');
    }
  }

  async function submitItem(event) {
    event.preventDefault();
    try {
      await api.post('/items', form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage('Your post has been added.');
      loadItems();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add your post.');
    }
  }

  async function deleteItem(id) {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete('/items/' + id);
      loadItems();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete post.');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setMessage('You have logged out.');
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><PackageSearch size={24} /></span> Find<span>It</span></a>
        <nav>
          <a href="#listings">Browse items</a>
          <a href="#how">How it works</a>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="welcome"><User size={16} /> {user.name}</span>
              <button className="button button-light" onClick={logout}><LogOut size={16} /> Log out</button>
            </>
          ) : (
            <button className="button button-light" onClick={() => { setAuthMode('login'); setShowAuth(true); }}><LogIn size={16} /> Log in</button>
          )}
          <button className="button button-primary" onClick={() => user ? setShowForm(true) : setShowAuth(true)}><Plus size={17} /> Post an item</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Heart size={15} /> A little help goes a long way</div>
            <h1>Lost something?<br /><span>Let's find it together.</span></h1>
            <p>A friendly community helping people reconnect with the things that matter. Browse recent posts or share what you've lost or found.</p>
            <div className="hero-buttons">
              <a className="button button-primary" href="#listings">Explore items <Search size={17} /></a>
              <button className="button button-outline" onClick={() => user ? setShowForm(true) : setShowAuth(true)}>Share an item <Plus size={17} /></button>
            </div>
            <div className="hero-note"><span className="dot" /> Community-powered. Simple. Helpful.</div>
          </div>
          <div className="hero-art">
            <div className="art-circle"><PackageSearch size={112} strokeWidth={1.2} /></div>
            <div className="floating-card card-one"><span className="mini-icon orange">⌕</span><div><b>Lost wallet</b><small>Help someone find it</small></div></div>
            <div className="floating-card card-two"><span className="mini-icon green">✓</span><div><b>Keys found!</b><small>One happy reunion</small></div></div>
            <div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✧</div>
          </div>
        </section>

        <section className="stats">
          <div><strong>{items.length}</strong><span>Posts to explore</span></div>
          <div><strong>Community</strong><span>People helping people</span></div>
          <div><strong>One goal</strong><span>Bring things back home</span></div>
        </section>

        <section className="listing-section" id="listings">
          <div className="section-heading">
            <div><div className="eyebrow">COMMUNITY BOARD</div><h2>Recent posts</h2><p>Search the board or choose what you'd like to see.</p></div>
            <button className="button button-primary" onClick={() => user ? setShowForm(true) : setShowAuth(true)}><Plus size={17} /> Add a post</button>
          </div>

          <div className="tools">
            <div className="search-box"><Search size={19} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by item or location..." /></div>
            <div className="filters">
              {['all', 'lost', 'found'].map(value => <button key={value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>{value === 'all' ? 'All posts' : value === 'lost' ? 'Lost items' : 'Found items'}</button>)}
            </div>
          </div>

          {message && <div className="notice">{message}<button onClick={() => setMessage('')}><X size={16} /></button></div>}

          {items.length === 0 ? (
            <div className="empty"><PackageSearch size={42} /><h3>No posts found</h3><p>Try another search, or be the first to add a post.</p></div>
          ) : (
            <div className="item-grid">
              {items.map(item => (
                <article className="item-card" key={item._id}>
                  <div className={item.type === 'lost' ? 'item-banner lost-banner' : 'item-banner found-banner'}>
                    <span className={item.type === 'lost' ? 'status lost-status' : 'status found-status'}>{item.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}</span>
                    <PackageSearch size={42} strokeWidth={1.4} />
                  </div>
                  <div className="item-content">
                    <div className="item-category">{item.category}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="item-detail"><MapPin size={15} /> {item.location}</div>
                    <div className="item-detail"><CalendarDays size={15} /> {new Date(item.date).toLocaleDateString()}</div>
                    <div className="item-footer"><span>Posted by {item.owner?.name || 'Community member'}</span>
                      {user && item.owner?._id === user.id && <button className="delete-link" onClick={() => deleteItem(item._id)}>Delete</button>}
                    </div>
                    <a className="contact-link" href={'mailto:' + (item.contact.includes('@') ? item.contact : '')} onClick={e => { if (!item.contact.includes('@')) { e.preventDefault(); window.alert('Contact: ' + item.contact); } }}>Contact poster</a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="how-section" id="how">
          <div className="eyebrow">HOW IT WORKS</div><h2>Three simple steps</h2>
          <div className="steps">
            <div><span>01</span><h3>Create an account</h3><p>Sign up so you can share a post and manage your listings.</p></div>
            <div><span>02</span><h3>Post or search</h3><p>Tell the community what you've lost or what you've found.</p></div>
            <div><span>03</span><h3>Make a connection</h3><p>Contact the poster and arrange a safe return.</p></div>
          </div>
        </section>
      </main>

      <footer><a className="brand" href="#"><span className="brand-icon"><PackageSearch size={22} /></span> Find<span>It</span></a><p>Good people. Helpful connections. Happy reunions.</p><small>© {new Date().getFullYear()} FindIt Lost & Found</small></footer>

      {showAuth && <div className="modal-backdrop" onClick={() => setShowAuth(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowAuth(false)}><X /></button>
        <div className="eyebrow">WELCOME TO FINDIT</div><h2>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="modal-subtitle">Join the community and help bring items home.</p>
        <form onSubmit={submitAuth}>
          {authMode === 'register' && <label>Your name<input required value={auth.name} onChange={e => setAuth({ ...auth, name: e.target.value })} placeholder="Your full name" /></label>}
          <label>Email address<input required type="email" value={auth.email} onChange={e => setAuth({ ...auth, email: e.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input required type="password" minLength="6" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} placeholder="At least 6 characters" /></label>
          <button className="button button-primary full-button">{authMode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <p className="switch-auth">{authMode === 'login' ? "New here?" : 'Already have an account?'} <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? 'Create an account' : 'Log in'}</button></p>
      </div></div>}

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowForm(false)}><X /></button>
        <div className="eyebrow">HELP THE COMMUNITY</div><h2>Share an item</h2><p className="modal-subtitle">Add clear details so people can recognise it.</p>
        <form onSubmit={submitItem}>
          <label>Post type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="lost">I lost something</option><option value="found">I found something</option></select></label>
          <label>Item name<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Example: Black backpack" /></label>
          <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{['Electronics', 'Documents', 'Wallet', 'Keys', 'Bag', 'Clothing', 'Jewelry', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label>
          <label>Description<textarea required rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the item..." /></label>
          <label>Location<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Where was it lost or found?" /></label>
          <label>Date<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
          <label>Contact (email or phone)<input required value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="How can someone reach you?" /></label>
          <button className="button button-primary full-button">Publish post</button>
        </form>
      </div></div>}
    </div>
  );
}

export default App;
