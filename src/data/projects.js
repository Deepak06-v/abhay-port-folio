/*!
  Projects Data - Phase 7
  Maintainable structure for portfolio projects.
  Keep separate from UI for easy editing.
*/

const projectsData = [
  {
    id: 1,
    title: 'DEER',
    type: 'MERN Fashion E-Commerce Website',
    description:
      'A modern fashion e-commerce platform built with the MERN stack, focused on a premium shopping experience and modern product discovery.',
    technologies: ['React', 'Vite', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Razorpay', 'Nodemailer', 'Cloudinary'],
    image: null,
    liveUrl: null,
    githubUrl: 'https://github.com/abhaykumar/dev-deer',
    status: 'Completed',
    featured: true,
  },
  {
    id: 2,
    title: 'FIXMATE',
    type: 'Local Services Platform Concept',
    description:
      'A platform concept designed to help people discover and hire local service workers for everyday needs.',
    technologies: [],
    image: null,
    liveUrl: null,
    githubUrl: null,
    status: 'Concept',
    featured: false,
  },
];

export default projectsData;