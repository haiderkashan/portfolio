import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function uploadImage(url: string) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename: 'mock-image.jpg',
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    }
  }
}

async function run() {
  console.log("Uploading dummy images...")
  const img1 = await uploadImage('https://picsum.photos/seed/p1/800/600')
  const img2 = await uploadImage('https://picsum.photos/seed/p2/800/600')
  const imgHero = await uploadImage('https://picsum.photos/seed/hero/1200/800')
  const imgAvatar = await uploadImage('https://picsum.photos/seed/avatar/400/400')

  console.log("Creating Site Settings...")
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Alex Coder',
    handle: 'alexcoder',
    role: 'Senior Full Stack Software Engineer',
    locationTag: 'Based in San Francisco',
    email: 'alex@example.com',
    socialLinks: [
      { _key: 'github', platform: 'GitHub', url: 'https://github.com' },
      { _key: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com' }
    ],
    heroImage: imgHero,
    ctaLabel: 'Let\'s build something',
    introHeadline: 'A software engineer who loves clean code, system architecture & solving complex problems.',
    introImage: imgAvatar,
    bio: 'Passionate about distributed systems, React, and building scalable web applications. I strive to create software that is robust, maintainable, and user-centered.',
    stats: [
      { _key: 's1', value: '10+', label: 'Years of Experience' },
      { _key: 's2', value: '50+', label: 'Projects Shipped' },
      { _key: 's3', value: '5', label: 'Open Source Contributions' }
    ],
    processImage: imgAvatar,
    processIntro: 'I focus on building scalable systems and writing maintainable code. From idea to deployment, I ensure the software meets business needs while being technically sound.',
    processSteps: [
      { _key: 'ps1', title: 'Architecture Design' },
      { _key: 'ps2', title: 'Implementation' },
      { _key: 'ps3', title: 'Testing & QA' },
      { _key: 'ps4', title: 'Deployment' }
    ],
    statement: 'Building the future of the web, one component at a time.',
    footerImage: imgAvatar,
    footerHeadline: 'Let\'s build something great!',
    seoDescription: 'Alex Coder - Software Engineer Portfolio'
  })

  console.log("Creating Projects...")
  const p1 = await client.create({
    _type: 'project',
    title: 'E-Commerce Microservices Platform',
    slug: { _type: 'slug', current: 'ecommerce-microservices' },
    period: '2023 — 2024',
    category: 'Backend Architecture',
    tagline: 'Scalable backend for a high-traffic e-commerce store.',
    excerpt: 'Designed and implemented a microservices architecture using Node.js, Docker, and Kubernetes.',
    thumbnail: img1,
    coverImage: img1,
    featured: true,
    liveUrl: 'https://example.com',
    secondaryLinkLabel: 'GitHub Repo',
    secondaryLinkUrl: 'https://github.com',
    gallery: [
      { ...img1, _key: 'g1' },
      { ...img2, _key: 'g2' }
    ],
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c1', text: 'Built the entire backend infrastructure...', marks: [] }]
      }
    ]
  })

  const p2 = await client.create({
    _type: 'project',
    title: 'Real-time Analytics Dashboard',
    slug: { _type: 'slug', current: 'analytics-dashboard' },
    period: '2022',
    category: 'Full Stack Development',
    tagline: 'Visualizing millions of data points in real-time.',
    excerpt: 'Built a real-time dashboard using React, WebSockets, and Redis to process and display high-volume data.',
    thumbnail: img2,
    coverImage: img2,
    featured: true,
    liveUrl: 'https://example.com',
    gallery: [
      { ...img2, _key: 'g3' }
    ],
    body: [
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c2', text: 'Handled the frontend and real-time streaming pipeline.', marks: [] }]
      }
    ]
  })

  console.log("Creating Education...")
  await client.create({
    _type: 'education',
    institution: 'University of California, Berkeley',
    degree: 'B.S. in Computer Science',
    startYear: '2014',
    endYear: '2018',
    current: false,
    description: 'Focused on algorithms, distributed systems, and artificial intelligence.',
    image: imgAvatar
  })

  console.log("Creating Services...")
  await client.create({
    _type: 'service',
    title: 'Full Stack Development',
    items: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'PostgreSQL / MongoDB'],
    previewImage: img1
  })
  
  await client.create({
    _type: 'service',
    title: 'Cloud Architecture & DevOps',
    items: ['AWS / GCP', 'Docker / Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code'],
    previewImage: img2
  })

  console.log("Creating Blog Posts...")
  await client.create({
    _type: 'post',
    title: 'Why TypeScript is Essential for Large Scale Apps',
    slug: { _type: 'slug', current: 'why-typescript' },
    excerpt: 'A deep dive into how static typing prevents bugs and improves developer experience in complex codebases.',
    coverImage: img1,
    tags: ['TypeScript', 'Architecture'],
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: 'block',
        _key: 'bp1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'c3', text: 'TypeScript has become the industry standard for web development...', marks: [] }]
      }
    ]
  })

  console.log("Creating Awards...")
  await client.create({
    _type: 'award',
    project: { _type: 'reference', _ref: p1._id },
    awardType: 'Best Cloud Architecture 2023',
    date: '2023-11-01'
  })

  console.log("Done adding mock data!")
}

run().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
