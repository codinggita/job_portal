import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import ImageAvatars from './ui/avatar.jsx';
import EditIcon from '@mui/icons-material/Edit';
import MailIcon from '@mui/icons-material/Mail';
import { Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import Badge from '@mui/material/Badge';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog.jsx';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '../hooks/useGetAppliedJobs.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';

function Profile() {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    console.log("User Data:", user); 

    if (!user) {
        return (
        <>
        <Navbar />
        <p className="text-center text-gray-600 mt-10">Loading profile...</p>
        </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <ImageAvatars sx={{ height: 96, width: 96 }} />
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname || "No Name"}</h1>
                            <p>{user?.profile?.bio || "No bio available"}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right">
                        <EditIcon />
                    </Button>
                </div>
                <div className='flex items-center gap-3 my-2'>
                    <MailIcon />
                    <span>{user?.email || "Not provided"}</span>
                </div>
                <div className='flex items-center gap-3 my-2'>
                    <PhoneIcon />
                    <span>{user?.phoneNumber || "Not provided"}</span>
                </div>
                <div>
                    <h1 className='mt-1 font-semibold'>Skills</h1>
                    <div className="flex flex-wrap gap-3">
                        {user?.profile?.skills?.length ? (
                            user.profile.skills.map((item, index) => (
                                <Badge key={index} overlap="rectangular" color="default">
                                    <span className="bg-blue-500 text-white rounded-full py-1 px-4 text-sm">
                                        {item}
                                    </span>
                                </Badge>
                            ))
                        ) : (
                            <span>NA</span>
                        )}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                        <label className='text-md font-bold'>Resume</label>
                        {user?.profile?.resume ? (
                            <a target='_blank' href={user.profile.resume} className='text-blue-500 hover:underline cursor-pointer'>
                                Download
                            </a>
                        ) : (
                            <span>NA</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto bg-white-2xl">
                <h1 className='font-bold text-2xl'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
            <AnalyticsDashboard/>
        </>
    );
}

export default Profile;
