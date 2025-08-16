"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "./Header";

export default function CourseCatalog() {
  const [courseData, setCourseData] = useState([]);
  const endpoint = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${endpoint}/get-courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("the data for the ", data?.data);
        setCourseData(data?.data);
      } catch (error) {
        console.error("the error while fetching data", error);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = ({ value }) => {
    console.log("the course", value);
    localStorage.setItem("course", value);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn Without Limits
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start, switch, or advance your career with more than 5,000 courses
            from world-class universities and companies.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {courseData.length} courses found
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courseData.map((course) => (
            <Card
              key={course.value}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => {
                handleCourseClick(course);
              }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={"/course.jpeg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.CourseName}
                </h3>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex items-center justify-between w-full">
                  <button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Enroll
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-400">
              &copy; 2025 myUstad.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
