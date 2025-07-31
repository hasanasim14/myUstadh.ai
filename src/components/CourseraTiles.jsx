"use client";

import { useState } from "react";
import { Search, Star, Clock, Users, ChevronDown } from "lucide-react";
// import { button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

// import { useRouter } from "next/navigation";

const courses = [
  {
    id: 1,
    title: "Machine Learning Specialization",
    instructor: "Andrew Ng",
    university: "Stanford University",
    rating: 4.9,
    reviewCount: 125000,
    duration: "3 months",
    level: "Beginner",
    price: 49,
    originalPrice: 79,
    image: "/placeholder.svg?height=200&width=300",
    category: "Data Science",
    enrolled: 2500000,
  },
  {
    id: 2,
    title: "Full-Stack Web Development",
    instructor: "Dr. Sarah Johnson",
    university: "University of Michigan",
    rating: 4.7,
    reviewCount: 89000,
    duration: "4 months",
    level: "Intermediate",
    price: 59,
    originalPrice: 99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    enrolled: 1800000,
  },
  {
    id: 3,
    title: "Digital Marketing Strategy",
    instructor: "Prof. Michael Chen",
    university: "Northwestern University",
    rating: 4.6,
    reviewCount: 67000,
    duration: "2 months",
    level: "Beginner",
    price: 39,
    image: "/placeholder.svg?height=200&width=300",
    category: "Business",
    enrolled: 950000,
  },
  {
    id: 4,
    title: "Data Analysis with Python",
    instructor: "Dr. Emily Rodriguez",
    university: "University of California",
    rating: 4.8,
    reviewCount: 156000,
    duration: "3 months",
    level: "Intermediate",
    price: 55,
    originalPrice: 85,
    image: "/placeholder.svg?height=200&width=300",
    category: "Data Science",
    enrolled: 2100000,
  },
  {
    id: 5,
    title: "UX/UI Design Fundamentals",
    instructor: "Jessica Park",
    university: "California Institute of Arts",
    rating: 4.5,
    reviewCount: 43000,
    duration: "6 weeks",
    level: "Beginner",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    category: "Design",
    enrolled: 780000,
  },
  {
    id: 6,
    title: "Financial Markets",
    instructor: "Prof. Robert Shiller",
    university: "Yale University",
    rating: 4.7,
    reviewCount: 98000,
    duration: "7 weeks",
    level: "Beginner",
    price: 0,
    image: "/placeholder.svg?height=200&width=300",
    category: "Business",
    enrolled: 1200000,
  },
  {
    id: 7,
    title: "Cloud Computing Basics",
    instructor: "Dr. Alex Kumar",
    university: "Amazon Web Services",
    rating: 4.6,
    reviewCount: 72000,
    duration: "5 weeks",
    level: "Beginner",
    price: 49,
    image: "/placeholder.svg?height=200&width=300",
    category: "Computer Science",
    enrolled: 890000,
  },
  {
    id: 8,
    title: "Psychology of Learning",
    instructor: "Dr. Maria Santos",
    university: "Harvard University",
    rating: 4.8,
    reviewCount: 134000,
    duration: "8 weeks",
    level: "Intermediate",
    price: 65,
    originalPrice: 95,
    image: "/placeholder.svg?height=200&width=300",
    category: "Psychology",
    enrolled: 1500000,
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
  //   const router = useRouter();
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
    // router.push("/");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-blue-600">LearnHub</div>
              <nav className="hidden md:flex space-x-6">
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Browse
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Degrees
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  For Business
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button variant="ghost">Log In</button>
              <button>Join for Free</button>
            </div>
          </div>
        </div>
      </header>

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

                <p className="text-sm text-gray-600 mb-1">
                  {course.university}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  {course.instructor}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {course.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({course.reviewCount.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {(course.enrolled / 1000000).toFixed(1)}M
                  </div>
                </div>
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
                        <span className="text-lg font-bold">
                          ${course.price}
                        </span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">
                LearnHub
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education from top
                universities and companies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Browse Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Degrees
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Certificates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Universities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Businesses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Government
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
