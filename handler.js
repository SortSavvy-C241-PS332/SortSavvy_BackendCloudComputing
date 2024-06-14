const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const addUserLoginList = async (request, h) => {
    console.log('Request payload:', request.payload); // Tambahkan log di sini

    const { fullName, email, password, confirmPassword } = request.payload;
    const profilePhoto = request.payload.profilePhoto;

    if (!email) {
        return h.response({
            status: 'fail',
            message: 'Email is required',
        }).code(400);
    }

    if (password !== confirmPassword) {
        return h.response({
            status: 'fail',
            message: 'Passwords do not match',
        }).code(400);
    }

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return h.response({
                status: 'fail',
                message: 'Email already exists',
            }).code(400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoPath = null;
        if (profilePhoto) {
            const filePath = `uploads/${Date.now()}_${profilePhoto.hapi.filename}`;
            const fileStream = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                profilePhoto.pipe(fileStream);
                profilePhoto.on('end', (err) => {
                    if (err) {
                        reject(err);
                    }
                    profilePhotoPath = filePath;
                    resolve();
                });
            });
        }

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            profilePhoto: profilePhotoPath // Menyimpan path file
        });

        return h.response({
            status: 'success',
            message: 'User registered successfully',
            data: {
                email: newUser.email,
                createdAt: newUser.createdAt,
                profilePhoto: newUser.profilePhoto,
            },
        }).code(201);
    } catch (err) {
        console.error('Error during user registration:', err); // Cetak stack trace dari error
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
        }).code(500);
    }
};

const updateUserProfile = async (request, h) => {
    console.log('Update request payload:', request.payload); // Tambahkan log di sini

    const { id } = request.params; // Assuming the user ID is passed as a parameter
    const { fullName, email, password } = request.payload;
    const profilePhoto = request.payload.profilePhoto;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(404);
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== id) {
                return h.response({
                    status: 'fail',
                    message: 'Email already in use',
                }).code(400);
            }
            user.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        if (profilePhoto) {
            const filePath = `uploads/${Date.now()}_${profilePhoto.hapi.filename}`;
            const fileStream = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                profilePhoto.pipe(fileStream);
                profilePhoto.on('end', (err) => {
                    if (err) {
                        reject(err);
                    }
                    user.profilePhoto = filePath;
                    resolve();
                });
            });
        }
        
        await user.save();

        return h.response({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                profilePhoto: user.profilePhoto,
            },
        }).code(200);
    } catch (err) {
        console.error('Error during profile update:', err); // Cetak stack trace dari error
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
        }).code(500);
    }
};

module.exports = { addUserLoginList, updateUserProfile };