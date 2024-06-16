const User = require('./models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (request, h) => {
    console.log('Received payload:', request.payload);

    const { fullName, email, password, confirmPassword } = request.payload;

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

        // Simpan pengguna baru tanpa profilePhoto
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            profilePhoto: null, // Atur ini ke null jika tidak ada profilePhoto
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
        console.error('Error during user registration:', err);
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
        }).code(500);
    }
};

const loginUser = async (request, h) => {
    console.log('Received payload:', request.payload);

    const { email, password } = request.payload;

    if (!email || !password) {
        return h.response({
            status: 'fail',
            message: 'Email and password are required',
        }).code(400);
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return h.response({
                status: 'fail',
                message: 'Email not found',
            }).code(400);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return h.response({
                status: 'fail',
                message: 'Incorrect password',
            }).code(400);
        }

        return h.response({
            status: 'success',
            message: 'Login successful',
            data: {
                email: user.email,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto,
            },
        }).code(200);
    } catch (err) {
        console.error('Error during user login:', err);
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
        }).code(500);
    }
};

const updateUserProfile = async (request, h) => {
    const { id } = request.params;
    const { fullName, email, password, profilePhoto } = request.payload;

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
        console.error('Error during profile update:', err);
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
        }).code(500);
    }
};

module.exports = { registerUser, loginUser, updateUserProfile };
