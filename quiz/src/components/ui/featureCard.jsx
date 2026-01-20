import '../../styles/feature.css';
import { Link } from "react-router-dom";

const featureData = [
    {
        title: "Smart To-Do Lists",
        icon: "📋",
        image: "todo.jpg",
        description: "Organize your tasks with intelligent lists, set deadlines, and prioritize effortlessly to stay on top of your daily goals.",
        btnText: "Explore Features",
        to: "/todos",

    },
    {
        title: "Interactive Flashcards",
        icon: "🗂️",
        image: "flashcard.jpg",
        description: "Master new concepts with dynamic flashcards, spaced repetition, and custom decks for effective and engaging learning.",
        btnText: "Start Learning",
        to: "/flashcards",
    },
    {
        title: "Notes & References",
        icon: "📝",
        image: "notes.jpg",
        description:
            "Access all your study notes and reference materials in one place. Organize, search, and review whenever you need.",
        btnText: "View Notes",
        to: "/notes",
    },
];/* Container */


const FeatureCard = ({ title, icon, image, description, btnText, to }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <img src={image} alt={title} className="feature-image" />
        <p className="feature-description">{description}</p>
        <Link to={to} className="feature-button">
            {btnText}
        </Link>
    </div>
);

export default function FeaturesSection() {
    return (
        <section className="features-container">
            <div className="features-grid">
                {featureData.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        title={feature.title}
                        icon={feature.icon}
                        image={feature.image}
                        description={feature.description}
                        btnText={feature.btnText}
                        to={feature.to}
                    />
                ))}
            </div>
        </section>
    );
}