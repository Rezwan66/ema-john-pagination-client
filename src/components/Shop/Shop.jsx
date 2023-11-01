import React, { useEffect, useState } from 'react';
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { count } = useLoaderData();
  //   console.log(count);
  //   const itemsPerPage = 10;
  const numberOfPages = Math.ceil(count / itemsPerPage);
  //   const pages = [];
  //   for (let i = 0; i < numberOfPages; i++) {
  //     pages.push(i);
  //   }
  const pages = [...Array(numberOfPages).keys()];
  console.log(pages);

  /**
   * Done 1: get the total number of products
   * TODO 2: number of items per page (dynamic)
   * 3: Calculate total number of pages: Math.ceil(count / itemsPerPage)
   * 4: Make array of pages: [...Array(numberOfPages).keys()]
   * 5: Create pagination control by mapping the pages array to display page number buttons.
   * 6: Set state of itemsPerPage, create a page size dropdown, and a handleItemsPerPage callback function onChange. This will change page array size, and buttons accordingly.
   */

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find(product => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = product => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find(pd => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter(pd => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemsPerPage = e => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setItemsPerPage(val);
  };

  return (
    <div>
      <div className="shop-container">
        <div className="products-container">
          {products.map(product => (
            <Product
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className="cart-container">
          <Cart cart={cart} handleClearCart={handleClearCart}>
            <Link className="proceed-link" to="/orders">
              <button className="btn-proceed">Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>
      <div className="pagination">
        {pages.map(page => (
          <button key={page}>{page}</button>
        ))}
        <select value={itemsPerPage} onChange={handleItemsPerPage}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
