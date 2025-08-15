"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import Navbar from "./Header";

const courses = [
  {
    id: 1,
    title: "Test Development and Evaluation",
    // instructor: "Andrew Ng",
    // university: "Stanford University",
    // rating: 4.9,
    // reviewCount: 125000,
    // duration: "3 months",
    // level: "Beginner",
    // price: 49,
    // originalPrice: 79,
    // image: "/placeholder.svg?height=200&width=300",
    // category: "Data Science",
    // enrolled: 2500000,
  },
];

const categories = [
  "All",
  "Data Science",
  "Computer Science",
  "Business",
  "Design",
  "Psychology",
];

export default function CourseCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCourseClick = () => {
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
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="What do you want to learn?"
              className="pl-10 py-3 text-gray-900 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-gray-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  variant="outline"
                  size="sm"
                  className="ml-auto bg-transparent"
                >
                  Sort by <ChevronDown className="ml-2 w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Most Popular</DropdownMenuItem>
                <DropdownMenuItem>Highest Rated</DropdownMenuItem>
                <DropdownMenuItem>Newest</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredCourses.length} courses found
          </h2>
          <p className="text-gray-600">
            {selectedCategory !== "All" &&
              `Showing courses in ${selectedCategory}`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={handleCourseClick}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  //   src={course.image || "/placeholder.svg"}
                  src={"/course.jpeg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* <Badge className="absolute top-3 left-3 bg-white text-gray-900"> */}
                {course.level}
                {/* </Badge> */}
              </div>

              <CardContent className="p-4">
                <div className="mb-2">
                  {/* <Badge variant="secondary" className="text-xs"> */}
                  {course.category}
                  {/* </Badge> */}
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>

                {/* <p className="text-sm text-gray-600 mb-1">
                  {course.university}
                </p> */}
                {/* <p className="text-sm text-gray-700 mb-3">
                  {course.instructor}
                </p> */}

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {/* <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {course.rating}
                    </span> */}
                  </div>
                  {/* <span className="text-sm text-gray-500">
                    ({course.reviewCount.toLocaleString()})
                  </span> */}
                </div>

                {/* 
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {(course.enrolled / 1000000).toFixed(1)}M
                  </div>
                </div> */}
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {course.price === 0 ? (
                      <span className="text-lg font-bold text-green-600">
                        Free
                      </span>
                    ) : (
                      <>
                        {/* <span className="text-lg font-bold">
                          ${course.price}
                        </span> */}
                        {course.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${course.originalPrice}
                          </span>
                        )}
                      </>
                    )}
                  </div>
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
