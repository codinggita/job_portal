import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Input, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';


const UpdateProfileDialog = ({ open, setOpen }) => {
    const user = useSelector(store => store.auth);
  const [input, setInput] = useState({
    fullname: user?.name,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map(skill => skill),
    file: user?.profile?.resume
  })

  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("bio", input.bio);
    formData.append("skills", JSON.stringify(input.skills));
    if (input.resume) {
      formData.append("file", input.resume);
    }
    

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // Make sure withCredentials is inside the config
        }
      );
      if(res.data.success){
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
      console.log('Response:', res.data); // Handle the successful response here
      setOpen(false); // Close the dialog after saving
    } catch (error) {
      console.error('Error:', error); 
      toast.error(error.response.data.message);
    }
    
    // Log and close dialog after saving
    console.log(input);
    setOpen(false); // Close the dialog after saving
  };

  const handleSkillChange = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setSkills([...skills, event.target.value]);
      event.target.value = ''; // Clear input after adding skill
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file && allowedTypes.includes(file.type)) {
      setResume(file);
      setFileError('');
    } else {
      setFileError('Please select a valid file (PDF, DOC, or DOCX)');
      setResume(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Bio"
          fullWidth
          multiline
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          margin="normal"
        />

        {/* Skills Input */}
        <TextField
          label="Skills"
          fullWidth
          onKeyDown={handleSkillChange}
          margin="normal"
          placeholder="Press Enter to add skill"
        />
        <Box mt={2}>
          {skills.length > 0 && skills.map((skill, index) => (
            <Chip key={index} label={skill} color="primary" sx={{ marginRight: 1, marginBottom: 1 }} />
          ))}
        </Box>

        {/* Resume File Upload */}
        <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Upload Resume (PDF, DOC, DOCX)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Input
              type="file"
              onChange={handleFileChange}
              fullWidth
              inputProps={{ accept: '.pdf,.doc,.docx' }}
              margin="normal"
              sx={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                fullWidth
                color="primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  padding: '8px 16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.dark',  // Darken the button on hover
                  },
                }}
              >
                <AttachFileIcon />
                Choose File
              </Button>
            </label>
          </Box>
          {fileError && (
            <Typography variant="body2" color="error" mt={1}>
              {fileError}
            </Typography>
          )}
          {resume && (
            <Box mt={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textPrimary">
                Selected file: {resume.name}
              </Typography>
              <Button variant="text" color="secondary" onClick={() => setResume(null)}>
                Remove Resume
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="contained" sx={{ marginRight: '5px' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant='contained' sx={{ margin: '20px' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfileDialog;
