export const navLinks = ['Experience', 'Projects', 'Education', 'Skills', 'Contact'];

export const experience = [
  {
    role: 'System Analyst',
    company: 'Datalink Creative Solutions Incorporation',
    period: 'Jul 2025 – Jan 2026',
    location: 'Metropolis Bagong Bayan, San Pablo City, Laguna',
    description: [
      'Analyzed user requirements through Prototypes and Flowcharts, delivering scalable software solutions that reduced response time by 40% ; ',
      'Developed web-based systems for Records Management, CRM, and Business Permit transactions, improving process efficiency by 65% ; ',
      'Collaborated with teams using Git and AI tools such as OpenAI and Anthropic Claude, accelerating development efficiency by 30%',
    ],
    tags: ['Systems Analysis', 'UML', 'Agile', 'Business Process', 'SQL', 'Git', 'OpenAI', 'Anthropic Claude'],
  },
  {
    role: 'Internship',
    company: 'Management Information System',
    period: 'Feb 2025 – May 2025',
    location: 'San Pablo City, Laguna Capitol',
    description: [
      'Developed a web-based Queueing system for the MIS office, optimizing transaction flow and reducing customer waiting time by 60% ; ',
      'Assisted citizens in using digital applications, improving user accessibility and reducing assistance time by 40%',
    ],
    tags: ['Web Development', 'Queue Management', 'Digital Assistance', 'UX'],
  },
];

export const projects = [
  {
    title: 'FORMA',
    description:
      'A modern and user-friendly clothing line website that offers stylish and affordable fashion for everyone through a clean and easy online shopping experience.',
    tags: ['TypeScript', 'Tailwind CSS', 'Vite'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/vansrzb/Forma',
    image: 'forma.jpg',
    featured: false,
  },
  {
    title: 'CRM System',
    description:
      'Integrated a real-time CRM system using Next.js and WebSockets, reducing operational complexity by 65% and enabling instant data synchronization.',
    tags: ['TypeScript', 'Next.js', 'MySQL', 'WebSockets'],
    date: 'Oct 25, 2025',
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/kevinbalocos/customer-relationship-management-system',
    image: 'https://opengraph.githubassets.com/1/kevinbalocos/customer-relationship-management-system',
    featured: false,
  },
  {
    title: 'Lantern',
    description:
      'A chatbot that lights the way to your thoughts — an AI-powered conversational interface built with a modern React front-end.',
    tags: ['Ruby', 'JavaScript', 'React.js', 'Tailwind CSS'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/vansrzb/lantern',
    image: 'lantern.jpg',
    featured: false,
  },
  {
    title: 'Records System',
    description:
      'Developed a digital records management system, reducing storage complexity by 60% and improving document retrieval efficiency.',
    tags: ['JavaScript', 'Node.js', 'MySQL'],
    date: 'Jul 31, 2025',
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/kevinbalocos/records-management-cong-system',
    image: 'rms.jpg',
    featured: false,
  },
  {
    title: 'Business Permit System',
    description:
      'Designed a business permit application management system, streamlining processing time by 65% and improving transaction efficiency.',
    tags: ['TypeScript', 'Node.js', 'MySQL'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/kevinbalocos/business-permit-system',
    image: 'business.jpg',
    featured: false,
  },
  {
    title: 'Evaluation System',
    description:
      'Built an Evaluation system that assesses teacher performance and tracks historical data, supporting 100+ student users across different college departments.',
    tags: ['PHP', 'JavaScript', 'MySQL'],
    date: 'Oct 1, 2024',
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/vansrzb/capstone-project-eva-lution',
    image: 'evaluation.png',
    featured: false,
  },
  {
    title: 'DCSI Website',
    description:
      'Official website of Datalink Creative Solutions Incorporation, built with a modern tech stack for a professional and responsive web presence.',
    tags: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/kevinbalocos/DCSI-WEBSITE',
    image: 'https://opengraph.githubassets.com/1/kevinbalocos/DCSI-WEBSITE',
    featured: false,
  },
  {
    title: 'Queueing System',
    description:
      'Developed a web-based Queueing system for the MIS office, optimizing transaction flow and reducing customer waiting time by 60%.',
    tags: ['PHP', 'JavaScript', 'MySQL'],
    date: 'Feb 11, 2025',
    role: 'Backend Developer',
    link: '#',
    github: 'https://github.com/kevinbalocos/Queueing-system',
    image: 'queueing.jpg',
    featured: false,
  },
  {
    title: 'IMS Cake Shop',
    description:
      'A system to manage inventory for a cake shop, handling stock tracking, product management, and order records.',
    tags: ['PHP', 'JavaScript', 'CSS'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/vansrzb/inventory-management-system-cake-shop',
    image: 'cakeshop.png',
    featured: false,
  },
  {
    title: 'Sales Dashboard',
    description:
      'A functional sales dashboard designed for a first client, providing clear data visualization and reporting tools.',
    tags: ['Ruby', 'React.js', 'Tailwind CSS'],
    date: null,
    role: 'Full-Stack Developer',
    link: '#',
    github: 'https://github.com/vansrzb/sales-dashboard',
    image: 'sales.png',
    featured: false,
  },
];

export const education = [
  {
    degree: 'Bachelor of Science in Information Technology',
    school: 'San Pablo Colleges',
    period: 'Aug 2021 – Jun 2025',
    location: 'Hermanos Belen St., San Pablo City, Laguna',
    gpa: '3.7',
    description: 'Graduated with honors. Specialized in software development and systems analysis. Capstone project focused on evaluation systems for Schools.',
    achievements: ['Cum Laude'],
  },
];

export const skills = {
  'Languages': ['TypeScript', 'JavaScript', 'Ruby', 'SQL', 'Java', 'PHP'],
  'Frontend': ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  'Backend': ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MySQL'],
  'Tools & Platforms': ['Git', 'GitHub', 'Figma', 'VS Code', 'Postman', 'Docker'],
  'Analysis': ['UML', 'BPMN', 'Systems Design', 'Agile/Scrum', 'ERD', 'Use Case'],
};

export const contact = {
  email: 'ibrilata.dev@gmail.com',
  github: 'https://github.com/vansrzb',
  linkedin: 'https://linkedin.com/in/vansrzb',
  location: 'Quezon, Province, PH',
};
