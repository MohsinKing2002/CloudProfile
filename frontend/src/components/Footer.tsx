import { Github, Gitlab, Globe, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const iconClass = "text-gray-500 mx-2";
export const Footer = () => {
  return (
    <footer className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
        <p className="text-sm text-gray-400">
          © 2025 <span className="text-indigo-400">CloudProfile</span>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link
            target="_blank"
            to={"https://www.linkedin.com/in/md-mohsin-raja-628370244/"}
          >
            <Linkedin className={iconClass} />
          </Link>
          <Link target="_blank" to={"https://github.com/mohsinKing2002/"}>
            <Github className={iconClass} />
          </Link>
          <Link target="_blank" to={"https://gitlab.com/MohsinKing2002"}>
            <Gitlab className={iconClass} />
          </Link>
          <Link
            target="_blank"
            to={"https://mohsinking2002.github.io/mohsin-portfolio/"}
          >
            <Globe className={iconClass} />
          </Link>
        </span>
      </div>
    </footer>
  );
};
