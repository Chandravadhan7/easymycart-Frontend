import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userAddress } from './fetchUserAddress';
import './addresspage.css';
import AddIcon from '@mui/icons-material/Add';
export default function Addresses() {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAddress());
  }, []);
  const address = useSelector((state) => state.address);
  console.log(address);

  const deleteAddress = async (id) => {
    let sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const response = await fetch(
      `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/address/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      },
    );
    if (response.ok) {
      dispatch(userAddress());
    } else {
      console.error('Failed to delete address');
    }
  };
  return (
    <div className="cont-add">
      <div className="address-head">Your Addresses</div>
      <div className="address-items-cont">
        <Link
          to={'/add-address'}
          className="address-item"
          style={{ border: '1px dashed gray' }}
        >
          <div style={{ color: 'gray' }}>
            <AddIcon fontSize="large" />
          </div>
          <div style={{ fontSize: '150%', color: 'black' }}>Add Address</div>
        </Link>
        {address.map((item) => {
          return (
            <div className="address-item">
              <div className="address-item-det">
                <div
                  style={{
                    height: '30%',
                    width: '96%',
                    textAlign: 'left',
                    lineHeight: '280%',
                    fontWeight: '550',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.fullName}
                </div>
                <div
                  style={{
                    height: '50%',
                    width: '96%',
                    textAlign: 'left',
                    lineHeight: '130%',
                    textTransform: 'capitalize',
                    fontSize: '90%',
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  }}
                >
                  {item?.flatNumber} {item?.area}, {item?.village},{' '}
                  {item?.district}, {item?.landMark} , {item?.village} -{' '}
                  {item?.pinCode} , {item?.state}
                </div>
                <div
                  style={{
                    height: '20%',
                    width: '96%',
                    textAlign: 'left',
                    lineHeight: '200%',
                    fontWeight: '450',
                  }}
                >
                  Phone Number :<span>{item?.phone}</span>
                </div>
              </div>
              <div className="add-edit">
                <div
                  style={{
                    height: '60%',
                    width: '96%',
                    display: 'flex',
                    gap: '5%',
                  }}
                >
                  <div
                    style={{
                      width: '20%',
                      height: '35%',
                      borderRight: '1px solid rgb(2, 91, 143)',
                    }}
                  >
                    <Link
                      to={`/address/edit/${item.id}`}
                      className="custom-link"
                    >
                      EDIT
                    </Link>
                  </div>
                  <div
                    onClick={() => deleteAddress(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    Remove
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
