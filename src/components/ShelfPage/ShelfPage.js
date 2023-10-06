import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './ShelfPage.css';

function ShelfPage() {
  const user = useSelector((store) => store.user)
  const [shelfList, setShelfList] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [newItemImage, setNewItemImage] = useState('')

  useEffect(() => {
    fetchShelf();
  }, []);

  const fetchShelf = () => {
    axios.get('/api/shelf').then((response) => {
      setShelfList(response.data);
    }).catch((error) => {
      console.log(error);
      alert('Something went wrong.');
    });
  }

  const addItem = (e) => {
    e.preventDefault();
    axios.post('/api/shelf', { description: newItem, image: newItemImage })
    .then((response) => {
      setNewItem('');
      setNewItemImage('');
      fetchShelf();
    })
    .catch((error) => {
      console.log(error);
      alert('Something went wrong')
    })
  }

  const removeItem = (id) => {
    axios.delete('/:id')
    .then((response) => {
      fetchShelf();
    })
    .catch((error) => {
      alert('Something went wrong deleting')
    })
  }

  return (
    <div className="container">
      <h2>Add Item:</h2>
      <form onSubmit={addItem}>
        Description: <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
        Image URL: <input type="text" value={newItemImage} onChange={(e) => setNewItemImage(e.target.value)} />
        <button type="submit">Add Item</button>
      </form>
      <h2>Shelf</h2>
      <p>All of the available items can be seen here.</p>
      {
        shelfList.length === 0 && (
          <div>No items on the shelf</div>
        )
      }
      {
        shelfList.map(item => {
          return <div className="responsive" key={item.id}>
                    <div className="gallery">
                        <img src={item.image_url} alt={item.description} />
                        <br />
                        <div className="desc">{item.description}</div>
                        <div style={{textAlign: 'center', padding: '5px'}}>
                          <button style={{cursor: 'pointer'}} onClick={() => removeItem(item.id)}>Delete</button>
                        </div>
                    </div>
                 </div>
        })
      }
      <div className="clearfix"></div>
    </div>
  );
}

export default ShelfPage;
