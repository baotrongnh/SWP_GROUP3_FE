import { StarOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import { Menu } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../../Components";
import { getProfileMentor } from "../../apis/mentor";
import './MentorProfile.scss';
import { AboutMentor, MentorInfor, RatingView, Skills } from "./components";
import { ModalBookMentor } from '../../Components/Modal';

function MentorProfile() {
     const [modalOpen, setModalOpen] = useState(false);
     const { id } = useParams('id');
     const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['mentorProfile', id], queryFn: () => getProfileMentor(id) });

     const items = [
          {
               label: 'About mentor',
               key: 'about',
               icon: <UserOutlined />,
          },
          {
               label: 'Skills',
               key: 'skills',
               icon: <UnorderedListOutlined />,
          },
          {
               label: 'Rating',
               key: 'rating',
               icon: <StarOutlined />,
          },
     ];

     const [currentTab, setCurrentTab] = useState('about');

     const onClick = (e) => {
          setCurrentTab(e.key);
     };

     const renderContent = () => {
          switch (currentTab) {
               case 'about': return <AboutMentor />
               case 'skills': return <Skills />
               case 'rating': return <RatingView />
          }
     }

     if (isLoading) {
          return <Loading />
     }

     if (isError) {
          return (
               <>
                    <h1>Đã xãy ra lỗi</h1>
                    <button onClick={() => refetch()}>try again</button>
               </>
          )
     }

     return (
          <div className="mentor-profile">
               <MentorInfor
                    id={id}
                    setModalOpen={setModalOpen}
                    profile={data?.mentor}
                    setCurrentTab={setCurrentTab}
               />

               <div className="container">
                    <Menu onClick={onClick} selectedKeys={[currentTab]} mode="horizontal" items={items} />
                    {renderContent()}
               </div>

               <ModalBookMentor modalOpen={modalOpen} setModalOpen={setModalOpen} currentIdMentor={id} />
          </div>
     );
}

export default MentorProfile;