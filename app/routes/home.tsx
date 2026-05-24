import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
// import {resumes} from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {resumes} from "~/constants";

export function meta({}: Route.MetaArgs) {

  return [
    { title: "ResuMate" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const {auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume[]>();
  const [loadingResumes, setLoadingResumes] = useState(false);
  // const [resumeUrl, setResumeUrl] = useState('');



  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated,navigate]);

  useEffect(() => {
    const loadResume = async ()=> {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes: Resume[] = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))
      console.log("parsedResumes", parsedResumes);
      setResume(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResume();
  }, []);

  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

  <section className="main-section">
    <div className="page-heading py-16">
    <h1>Track you Applications & Resume Ratings </h1>
      {!loadingResumes && resumes?.length === 0 ? (
          <h2>No resumes found. Upload your first resume to get feedback</h2>
      ):(
          <h2>Review your submissions & check AI-powered feedback</h2>
      )}
    </div>
    {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt=""/>
        </div>
    )}


    {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {
            resumes.map((resume) => (

                <ResumeCard key={resume.id} resume={resume}/>
            ))}
        </div>
    )}

    {!loadingResumes && resumes?.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
        </div>
    )}
  </section>
  </main>
  );
}
