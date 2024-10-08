import { Row, Col, Input, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './Header.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Contexts/AppContext';
import { Icon } from '@iconify/react/dist/iconify.js';
import useDebounce from '../../hooks/useDebounce';
import { AuthContext } from '../../Contexts/AuthContext';
import { deleteToken } from '../../utils/storageUtils';
import defaultAvatar from '../../assets/Photos/avatar/default_avatar.jpg';
import logo from '../../assets/Photos/logo/logo.png';

function Header() {
     const { setFilterMentor, filterMentor } = useContext(AppContext);
     const { currentUser, setCurrentUser } = useContext(AuthContext);
     const [searchValue, setSearchValue] = useState(null);
     const location = useLocation();
     const navigate = useNavigate();
     const debounceSearchValue = useDebounce(searchValue, 800);

     const onSearch = (value) => {
          const url = '/mentorlist'
          if (location.pathname !== url) {
               navigate(url);
          }
          setFilterMentor({ ...filterMentor, search: value });
     }

     const handleChange = (e) => {
          setSearchValue(e.target.value);
     }

     const handleLogout = () => {
          setCurrentUser(undefined);
          deleteToken();
     }

     useEffect(() => {
          if (debounceSearchValue !== null) {
               setFilterMentor({ ...filterMentor, search: debounceSearchValue });
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [debounceSearchValue]);

     const items = [
          {
               label: (
                    <Link>
                         Add member
                    </Link>
               ),
               key: '0',
          },
          {
               label: (
                    <Link >
                         History
                    </Link>
               ),
               key: '1',
          },
          {
               type: 'divider',
          },
          {
               label: '3rd menu item（disabled）',
               key: '3',
               disabled: true,
          },
     ];

     const accountSubMenu = [
          {
               type: 'divider'
          },
          {
               label: (
                    <Link to="/profile">
                         Profile
                    </Link>
               ),
               key: '0',
          },
          {
               label: (
                    <Link to="/settings">
                         Point wallet
                    </Link>
               ),
               key: '1',
          },
          {
               type: 'divider',
          },
          {
               label: (
                    <div onClick={handleLogout}>Logout</div>
               ),
               key: '3',
               danger: true
          },
     ];

     return (
          <div className="header">
               <div className="container">
                    <Row className='header-block'>
                         <Col className='logo-block' xs={3} lg={5}>
                              <Link>
                                   <img className='logo-img' src={logo} alt="" />
                              </Link>
                         </Col>

                         <Col className='search-block' xs={18} lg={8}>
                              <Input.Search
                                   placeholder="Find mentors"
                                   onSearch={onSearch}
                                   style={{
                                        width: '100%',
                                   }}
                                   size='large'
                                   allowClear
                                   onClear={() => setFilterMentor({ ...filterMentor, search: '' })}
                                   onChange={e => handleChange(e)}
                              />
                         </Col>

                         <Col xs={0} md={0} lg={11}>
                              <div className='btn-block'>
                                   <Link to={`/schedule/${currentUser.id}`} className='navbar-link'>Schedule</Link>
                                   <Link className='navbar-link'>Deposit</Link>
                                   <Dropdown
                                        menu={{
                                             items,
                                        }}
                                        placement='bottom'
                                   >
                                        <Link className='navbar-link' onClick={(e) => e.preventDefault()}>
                                             <Space>
                                                  More
                                                  <DownOutlined />
                                             </Space>
                                        </Link>
                                   </Dropdown>

                                   <Dropdown
                                        menu={{
                                             items: accountSubMenu
                                        }}
                                        placement='bottomRight'
                                   >
                                        <Link to='/profile' className='navbar-link account'>
                                             {currentUser.imgPath
                                                  ? <img className='avatar' src={currentUser.imgPath} alt="" onError={(e) => e.target.src = defaultAvatar} />
                                                  : <Icon className='icon' icon="material-symbols-light:account-circle" />
                                             }
                                        </Link>
                                   </Dropdown>
                              </div>
                         </Col>

                         <Col xs={3} lg={0} className='btn-navbar-mobile'>
                              <h1>mobile</h1>
                         </Col>
                    </Row>
               </div>
          </div>
     )
}

export default Header