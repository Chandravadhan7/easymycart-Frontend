import { useState, useEffect } from 'react';
import { removeFromCart } from '../../store/slices/cartSlice';
import { useDispatch } from 'react-redux';
import './quantity.css';

export default function Quantity({ cartItem }) {
  const [cartDetails, setCartDetails] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    fetch(
      'http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/',
      {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setCartId(data.id);
        console.log('Cart entity response:', JSON.stringify(data, null, 2));
      })
      .catch((error) => console.error('Error fetching cart entity:', error));
  }, []);

  useEffect(() => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    if (cartId && cartItem.id) {
      setLoading(true);
      fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/${cartId}/${cartItem.id}`,
        {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => setCartDetails(data))
        .catch((error) =>
          console.error('Error fetching cart item details:', error),
        )
        .finally(() => setLoading(false));
    }
  }, [cartId, cartItem.id]);

  async function increment() {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      const response = await fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/cartitems/${cartItem.id}/increment`,
        {
          method: 'PATCH',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      );
      if (response.ok) {
        setCartDetails((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
      } else {
        throw new Error('Failed to increment quantity');
      }
    } catch (err) {
      console.error('Error incrementing quantity:', err);
    }
  }

  async function decrement() {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      const response = await fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/cartitems/${cartItem.id}/decrement`,
        {
          method: 'PATCH',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      );
      if (response.ok) {
        setCartDetails(
          (prev) =>
            prev.quantity > 1 ? { ...prev, quantity: prev.quantity - 1 } : null, // Set to null if quantity is 1
        );
      } else {
        throw new Error('Failed to decrement quantity');
      }
    } catch (err) {
      console.error('Error decrementing quantity:', err);
    }
  }

  async function handleRemoveFromCart() {
    const productId = cartItem.id;

    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      const response = await fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/${productId}`,
        {
          method: 'DELETE',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      );

      if (response.ok) {
        console.log('Product removed successfully');
        dispatch(removeFromCart(productId));
        setCartDetails(null); // Clear the UI
      } else {
        console.error('Failed to remove product from cart');
      }
    } catch (error) {
      console.error('Error while removing product:', error);
    }
  }

  return (
    <div>
      {loading ? (
        <span>Loading...</span>
      ) : cartDetails ? (
        <div className="quantityy">
          <button
            onClick={() => {
              cartDetails.quantity > 1 ? decrement() : handleRemoveFromCart();
              setTimeout(() => window.location.reload(), 100); // reload after async
            }}
            disabled={cartDetails.quantity <= 0}
            className="plus"
          >
            –
          </button>
          <span className="num">{cartDetails.quantity}</span>
          <button
            onClick={() => {
              increment();
              setTimeout(() => window.location.reload(), 100); // reload after async
            }}
            disabled={cartDetails.quantity >= 10}
            className="plus"
          >
            +
          </button>
        </div>
      ) : (
        <span>No items found or removed from cart.</span>
      )}
    </div>
  );
}
