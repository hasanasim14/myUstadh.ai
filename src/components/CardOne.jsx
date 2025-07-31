import React, { useState } from "react";
import {
  FiChevronLeft,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./CardOne.css";

const CardOne = ({ selectedDocs, setSelectedDocs, onCollapseChange }) => {
  // this state variable has been added to keep track of which modules are open
  const [openModules, setOpenModules] = useState({});
  // this state variable has been added to store the document that is currently opened
  const [openedDoc, setOpenedDoc] = useState(null);
  const endpoint = import.meta.env.VITE_API_URL;

  // this function has been added to toggle the open state of a module
  const toggleModule = (moduleName) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };
  // maintaining the state for card
  const [isCollapsed, setIsCollapsed] = useState(false);

  // this function has been added to handle the checkbox change event
  // const handleCheckboxChange = (doc) => {
  //   setSelectedDocs(prevSelected => {
  //     const exists = prevSelected.some(d => d.id === doc.id);
  //     if (exists) {
  //       return prevSelected.filter(d => d.id !== doc.id);
  //     } else {
  //       return [...prevSelected, doc];
  //     }
  //   });
  // };

  const handleCheckboxChange = (doc) => {
    setSelectedDocs((prevSelected) => {
      const exists = prevSelected.some((d) => d.uniqueId === doc.uniqueId);
      if (exists) {
        return prevSelected.filter((d) => d.uniqueId !== doc.uniqueId);
      } else {
        return [...prevSelected, doc];
      }
    });
  };

  // this function has been added to display the contents of a document when the user clicks on it
  const openDocument = async (doc) => {
    try {
      const fileType = doc.viewpath.split(".").pop();

      if (fileType === "mp4") {
        setOpenedDoc({ name: doc.name, content: null, video: doc.viewpath });
        return;
      }

      const res = await fetch(doc.viewpath);
      const text = await res.text();
      setOpenedDoc({ name: doc.name, content: text, video: null });
    } catch (error) {
      console.error("Error loading document", error);
      setOpenedDoc({
        name: doc.name,
        content: "⚠️ Unable to load document.",
        video: null,
      });
    }
  };

  // this is the data structure that contains the card data, basically the modules and documents
  const criminalLawModules = {
    title: "Criminal Law",
    modules: [
      {
        name: "Topic 1: Module Introduction",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Module Introduction",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 1\\1.md",
            source: "Topic 1 – Module introduction",
            chapter: null,
            viewpath: "/docs/topic-1-module-introduction.md",
          },
          {
            id: 2,
            name: " Induction Slides",
            mapping: "Induction Slides Module Introduction",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 1\\1.0-criminalinduction-slides.md",
            source: "Criminal law Induction (Oct 2024)",
            chapter: null,
            viewpath: "/docs/criminal-law-induction-oct-2024.md",
          },
          {
            id: 3,
            name: " Introduction Video",
            mapping: "Introduction Video ",
            path: "",
            source: "Clarifying the purposes of educational assessment",
            chapter: null,
            viewpath: `${endpoint}/video/criminal.mp4`,
          },
        ],
      },
      {
        name: "Topic 2: Understanding the building blocks of Criminal Liability",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping:
              "Lecture Notes Understanding the building blocks of Criminal Liability",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 2\\2.md",
            source:
              "Topic 2 - Understanding the building blocks of criminal liability",
            chapter: null,
            viewpath:
              "/docs/topic-2-understanding-the-building-blocks-of-criminal-liability.md",
          },
        ],
      },
      {
        name: "Topic 3: Actus reus: conduct and circumstances",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Actus reus conduct and circumstances",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 3\\3.md",
            source: "Topic 3 - Actus reus: conduct and circumstances",
            chapter: null,
            viewpath: "/docs/topic-3-actus-reus-conduct-and-circumstances.md",
          },
          {
            id: 2,
            name: "Lecture Plus 1 Slides",
            mapping:
              "Lecture Plus 1 Slides Actus reus conduct and circumstances",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 3\\3_lecture_slides.md",
            source: "Actus Reus",
            chapter: null,
            viewpath: "/docs/actus-reus.md",
          },
        ],
      },
      {
        name: "Topic 4: Actus reus: consequences and their causes",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Actus reus consequences and their causes",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 4\\4.md",
            source: "Topic 4 - Actus reus: consequences and their causes",
            chapter: null,
            viewpath:
              "/docs/topic-4-actus-reus-consequences-and-their-causes.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Slides Mens Rea criminal fault",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 4\\4_minilecture1_slides.md",
            source: "The Chain of Causation",
            chapter: null,
            viewpath: "/docs/the-chain-of-causation.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping: "Mini Lecture 2 Slides Mens Rea criminal fault",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 4\\4_minilecture2_slides.md",
            source: "How can the chain of causation be broken?",
            chapter: null,
            viewpath: "/docs/how-can-the-chain-of-causation-be-broken.md",
          },
        ],
      },
      {
        name: "Topic 5: Mens Rea: criminal fault",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Mens Rea criminal fault",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 5\\5.md",
            source: "Topic 5 - Mens rea: criminal fault",
            chapter: null,
            viewpath: "/docs/topic-5-mens-rea-criminal-fault.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Slides Mens Rea criminal fault",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 5\\5_minilecture1_slides.md",
            source: "Mens Rea – Proving Fault",
            chapter: null,
            viewpath: "/docs/mens-rea-proving-fault.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping: "Mini Lecture 2 Slides Mens Rea criminal fault",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 5\\5_minilecture2_slides.md",
            source: "Intention in the Criminal Law",
            chapter: null,
            viewpath: "/docs/intention-in-the-criminal-law.md",
          },
        ],
      },
      {
        name: "Topic 6: Coincidence of Actus Reus and Mens Rea",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Coincidence of Actus Reus and Mens Rea",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 6\\6.md",
            source: "Topic 6 – Coincidence of actus reus and mens rea",
            chapter: null,
            viewpath: "/docs/topic-6-coincidence-of-actus-reus-and-mens-rea.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping:
              "Mini Lecture 1 Slides Coincidence of Actus Reus and Mens Rea",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 6\\6_minilecture1_slides.md",
            source: "Miller – How case law develops",
            chapter: null,
            viewpath: "/docs/miller-how-case-law-develops.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping:
              "Mini Lecture 2 Slides Coincidence of Actus Reus and Mens Rea ",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 6\\6_minilecture2_slides.md",
            source: "Coincidence of actus reus and mens rea",
            chapter: null,
            viewpath: "/docs/coincidence-of-actus-reus-and-mens-rea.md",
          },
        ],
      },
      {
        name: "Topic 7: Criminal Homicide",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Criminal Homicide",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 7\\7.md",
            source: "Topic 7 - Criminal homicide",
            chapter: null,
            viewpath: "/docs/topic-7-criminal-homicide.md",
          },
          {
            id: 2,
            name: "Lecture Plus 1 Slides",
            mapping: "Lecture Plus 1 Slides Criminal Homicide",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 7\\7_lectureplus1_slides.md",
            source: "Murder and partial defences",
            chapter: null,
            viewpath: "/docs/murder-and-partial-defences.md",
          },
          {
            id: 3,
            name: "Lecture Plus 2 Slides",
            mapping: "Lecture Plus 2 Slides Criminal Homicide",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 7\\7_lectureplus2_slides.md",
            source: "Criminal Law: Involuntary Manslaughter",
            chapter: null,
            viewpath: "/docs/criminal-law-involuntary-manslaughter.md",
          },
          {
            id: 4,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Criminal Homicide",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 7\\7_minilecture1_slides.md",
            source: "What's Wrong with Murder",
            chapter: null,
            viewpath: "/docs/whats-wrong-with-murder.md",
          },
          {
            id: 5,
            name: "Mini Lecture 2 Slides",
            mapping: "Mini Lecture 2 Slides Criminal Homicide",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 7\\7_minilecture2_slides.md",
            source: "What's Wrong with Murder",
            chapter: null,
            viewpath: "/docs/whats-wrong-with-murder-2.md",
          },
        ],
      },
      {
        name: "Topic 8: Rape",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Non-fatal Offences Against the Person",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 8\\8.md",
            source: "Topic 8 - Rape",
            chapter: null,
            viewpath: "/docs/topic-8-rape.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Rape",
            path: ":\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 8\\8_minilecture1_slides.md",
            source: "Rape: The Basic Elements",
            chapter: null,
            viewpath: "/docs/rape-the-basic-elements.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping: "Mini Lecture 2 Slides Rape",
            path: ":\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 8\\8_minilecture2_slides.md",
            source: "Consent and sexual offences",
            chapter: null,
            viewpath: "/docs/consent-and-sexual-offences.md",
          },
        ],
      },
      {
        name: "Topic 9: Non-fatal Offences Against the Person",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Non-fatal Offences Against the Person",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 9\\9.md",
            source: "Topic 9 - Non-fatal offences against the person",
            chapter: null,
            viewpath: "/docs/topic-9-non-fatal-offences-against-the-person.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Non-fatal Offences Against the Person",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 9\\9_minilecture1_slides.md",
            source: "The Forms of Non Fatal Offences: Common Assault",
            chapter: null,
            viewpath: "/docs/the-forms-of-non-fatal-offences-common-assault.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping:
              "Mini Lecture 2 Slides Non-fatal Offences Against the Person",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 9\\9_minilecture2_slides.md",
            source: "Non fatal offences",
            chapter: null,
            viewpath: "/docs/non-fatal-offences.md",
          },
          {
            id: 4,
            name: "Mini Lecture 3 Slides",
            mapping:
              "Mini Lecture 3 Slides Non-fatal Offences Against the Person",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 9\\9_minilecture3_slides.md",
            source: "Tackling multi-part problem questions",
            chapter: null,
            viewpath: "/docs/tackling-multi-part-problem-questions.md",
          },
        ],
      },
      {
        name: "Topic 10: Defences 1: Failure of Proof",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Defences 1 Failure of Proof",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 10\\10.md",
            source: "Topic 10 - Defences 1: failure of proof",
            chapter: null,
            viewpath: "/docs/topic-10-defences-1-failure-of-proof.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping: "Mini Lecture 1 Slides Defences 1 Failure of Proof",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 10\\10_minilecture1_slides.md",
            source:
              "General defences 1 Introduction and Failure of Proof Defences Professor William Wilson",
            chapter: null,
            viewpath:
              "/docs/general-defences-1-introduction-and-failure-of-proof-defences-professor-william-wilson.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping: "Mini Lecture 2 Slides Defences 1 Failure of Proof",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 10\\10_minilecture2_slides.md",
            source: "Failure of proof defences",
            chapter: null,
            viewpath: "/docs/failure-of-proof-defences.md",
          },
          {
            id: 4,
            name: "Mini Lecture 3 Slides",
            mapping: "Mini Lecture 3 Slides Defences 1 Failure of Proof",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 10\\0_minilecture3_slides.md",
            source: "Intoxication",
            chapter: null,
            viewpath: "/docs/intoxication.md",
          },
        ],
      },
      {
        name: "Topic 11: Defences 2: Justification and Excuse",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Defences 2 Justification and Excuse",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 11\\11.md",
            source: "Topic 11 – Defences 2: affirmative defences",
            chapter: null,
            viewpath: "/docs/topic-11-defences-2-affirmative-defences.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping:
              "Mini Lecture 1 Slides Defences 2 Justification and Excuse",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 11\\11_minilecture1_slides.md",
            source: "Affirmative Defences",
            chapter: null,
            viewpath: "/docs/affirmative-defences.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping:
              "Mini Lecture 2 Slides Defences 2 Justification and Excuse",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 11\\ll_minilecture2_slides.md",
            source: "Duress",
            chapter: null,
            viewpath: "/docs/duress.md",
          },
        ],
      },
      {
        name: "Topic 12: Property Offences 1: theft and burglary",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping: "Lecture Notes Property Offences 1 theft and burglary",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 12\\12.md",
            source: "Topic 12 - Property offences 1: theft and burglary",
            chapter: null,
            viewpath:
              "/docs/topic-12-property-offences-1-theft-and-burglary2.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping:
              "Mini Lecture 1 Slides Property Offences 1 theft and burglary",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 12\\12_minilecture1_slides.md",
            source: "Property Offences 1: Theft",
            chapter: null,
            viewpath: "/docs/property-offences-1-theft.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides",
            mapping:
              "Mini Lecture 2 Slides Property Offences 1 theft and burglary",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 12\\12_minilecture2_slides.md",
            source: "Theft: Appropriating Property",
            chapter: null,
            viewpath: "/docs/theft-appropriating-property.md",
          },
        ],
      },
      {
        name: "Topic 13: Property Offences 2: Fraud and Making off without Payment",
        documents: [
          {
            id: 1,
            name: "Lecture Notes",
            mapping:
              "Lecture Notes Property Offences 2 Fraud and Making off without Payment",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 13\\13.md",
            source:
              "Topic 13 - Property offences 2: fraud and making off without payment",
            chapter: null,
            viewpath:
              "/docs/topic-13-property-offences-2-fraud-and-making-off-without-payment.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides",
            mapping:
              "Mini Lecture 1 Slides Property Offences 2 Fraud and Making off without Payment",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 13\\13_minilecture1_slides.md",
            source: "Fraud",
            chapter: null,
            viewpath: "/docs/fraud.md",
          },
        ],
      },
      {
        name: "Topic 14: Property Offences 3: Criminal Damage",
        documents: [
          {
            id: 1,
            name: "LectureNotes",
            mapping: "Lecture Notes Property Offences 3 Criminal Damage",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 14\\14.md",
            source: "Topic 14 - Property offences 3: criminal damage",
            chapter: null,
            viewpath: "/docs/topic-14-property-offences-3-criminal-damage.md",
          },
          {
            id: 2,
            name: "Mini Lecture 1 Slides ",
            mapping:
              "Mini Lecture 1 Slides  Property Offences 3 Criminal Damage",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 14\\14_minilecture1_slides.md",
            source: "Criminal Damage: The Conduct Element",
            chapter: null,
            viewpath: "/docs/criminal-damage-the-conduct-element.md",
          },
          {
            id: 3,
            name: "Mini Lecture 2 Slides ",
            mapping:
              "Mini Lecture 2 Slides Property Offences 3 Criminal Damage",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\Topic 14\\14_minilecture2_slides.md",
            source: "The Fault Element in Criminal Damage",
            chapter: null,
            viewpath: "/docs/the-fault-element-in-criminal-damage.md",
          },
        ],
      },
      {
        name: "Book",
        documents: [
          {
            id: 1,
            name: "Chapter 1",
            mapping: "Chapter 1",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter1.md",
            chapter: "1: Introduction**",
            viewpath: "/docs/chapter1.md",
          },
          {
            id: 2,
            name: "Chapter 2",
            mapping: "Chapter 2",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter2.md",
            source: "**Criminal law**",
            chapter: "2: The building blocks of criminal liability",
            viewpath: "/docs/chapter2.md",
          },
          {
            id: 3,
            name: "Chapter 3",
            mapping: "Chapter 3",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter3.md",
            source: "**Criminal law**",
            chapter: "3: *Actus reus*: conduct and circumstances",
            viewpath: "/docs/chapter3.md",
          },
          {
            id: 4,
            name: "Chapter 4",
            mapping: "Chapter 4",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter4.md",
            source: "**Criminal law**",
            chapter: "4: *Actus reus***: consequences and their causes",
            viewpath: "/docs/chapter4.md",
          },
          {
            id: 5,
            name: "Chapter 5",
            mapping: "Chapter 5",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter5.md",
            source: "**Criminal law**",
            chapter: "5: *Mens rea***: criminal fault",
            viewpath: "/docs/chapter5.md",
          },
          {
            id: 6,
            name: "Chapter 6",
            mapping: "Chapter 6",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter6.md",
            source: "**Criminal law**",
            chapter: "6: Coincidence of** *actus reus* **and** *mens rea*",
            viewpath: "/docs/chapter6.md",
          },
          {
            id: 7,
            name: "Chapter 7",
            mapping: "Chapter 7",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter7.md",
            source: "**Criminal law**",
            chapter: "7: Criminal homicide",
            viewpath: "/docs/chapter7.md",
          },
          {
            id: 8,
            name: "Chapter 8",
            mapping: "Chapter 8",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter8.md",
            source: "**Criminal law**",
            chapter: "**8: Rape**",
            viewpath: "/docs/chapter8.md",
          },
          {
            id: 9,
            name: "Chapter 9",
            mapping: "Chapter 9",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter9.md",
            source: "**Criminal law**",
            chapter: "9: Non-fatal offences against the person**",
            viewpath: "/docs/chapter9.md",
          },
          {
            id: 10,
            name: "Chapter 10",
            mapping: "Chapter 10",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter10.md",
            source: "**Criminal law**",
            chapter: "10 Defences 1: failure of proof**",
            viewpath: "/docs/chapter10.md",
          },
          {
            id: 11,
            name: "Chapter 11",
            mapping: "Chapter 11",
            path: "C:\\Users\\Maham Jafri\\Documents\\Office Tasks\\SZABIST-Ustadh\\criminal\\mds\\criminal_law\\chapter11.md",
            source: "**Criminal law**",
            chapter: "11 Defences 2: affirmative defences**",
            viewpath: "/docs/chapter11.md",
          },
        ],
      },
    ],
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev;
      if (onCollapseChange) {
        onCollapseChange(newCollapsed);
      }
      return newCollapsed;
    });
  };

  return (
    <div
      className={`h-[85vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        // When collapsed: center the button in the entire card
        <div className="flex justify-center p-3 border-b border-gray-200">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            <FiChevronRight />
          </button>
        </div>
      ) : (
        // When expanded: show header + content
        <>
          {/* Header */}
          <div className="card-header">
            {/* <div className="flex items-center justify-between p-2"> */}
            <span className="title text-lg font-semibold">Course Content</span>
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <FiChevronLeft />
            </button>
          </div>

          {/* Content */}
          <div className="card-content">
            <div className={`scroll-area ${!openedDoc ? "scrollable" : ""}`}>
              {openedDoc ? (
                <div className="opened-doc-full p-4">
                  <div className="flex justify-between items-center pl-6">
                    <h3 className="uppercase">{openedDoc.name}</h3>
                    <button
                      onClick={() => setOpenedDoc(null)}
                      className="text-red-500 text-xl hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="mt-2 doc-content">
                    {openedDoc.video ? (
                      <video
                        src={openedDoc.video}
                        className="rounded-lg w-full max-h-64 object-cover"
                        autoPlay
                        loop
                        controls
                        playsInline
                      />
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {openedDoc.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="px-4 font-medium text-gray-700">
                    {criminalLawModules.title}
                  </h3>

                  {criminalLawModules?.modules?.map((module, idx) => {
                    const isOpen = openModules[module.name];
                    return (
                      <div key={idx} className="module px-4 py-2">
                        <div
                          className="module-header flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          onClick={() => toggleModule(module.name)}
                        >
                          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                          <span className="module-name font-medium">
                            {module.name}
                          </span>
                        </div>

                        {isOpen && module.documents.length > 0 && (
                          <div className="module-documents pl-6">
                            {module.documents.map((doc, docIdx) => (
                              <div
                                key={docIdx}
                                className="document flex items-center gap-2 py-1"
                              >
                                <FiFileText className="doc-icon text-gray-500" />
                                <span
                                  className="doc-link cursor-pointer hover:underline"
                                  onClick={() => openDocument(doc)}
                                >
                                  {doc.name}
                                </span>
                                <input
                                  type="checkbox"
                                  className="doc-checkbox ml-auto"
                                  checked={selectedDocs.some(
                                    (d) =>
                                      d.uniqueId === `${module.name}-${doc.id}`
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange({
                                      ...doc,
                                      uniqueId: `${module.name}-${doc.id}`,
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOne;

// below is the implementation for opening a pdf instead of a markdown file in the left panel when the user clicks on the document name
//   const openDocument = (doc) => {
//   setOpenedDoc({
//     name: doc.name,
//     viewpath: doc.viewpath
//   });
// };

{
  /* <div className="card-content">
  {openedDoc ? (
    <div className="opened-doc-full" style={{ padding: '20px', backgroundColor: ' f9f9f9', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{openedDoc.name}</h3>
        <button
          onClick={() => setOpenedDoc(null)}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {openedDoc.viewpath.toLowerCase().endsWith('.pdf') ? (
          // === Render PDF in iframe ===
          <iframe
            src={openedDoc.viewpath}
            title={openedDoc.name}
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          ></iframe>
        ) : (
          // === Fallback if not PDF, treat as text/markdown ===
          <ReactMarkdown>{openedDoc.content}</ReactMarkdown>
        )}
      </div>
    </div>
  ) : (
    // === Normal modules view ===
    <>
      <h3>Test Development and Evaluation</h3>

      {criminalLawModules.modules.map((module, idx) => {
        const isOpen = openModules[module.name];
        return (
          <div key={idx} className="module">
            <div className="module-header" onClick={() => toggleModule(module.name)}>
              {isOpen ? <FiChevronDown /> : <FiChevronRight />}
              <span className="module-name">{module.name}</span>
            </div>
            {isOpen && module.documents.length > 0 && (
              <div className="module-documents">
                {module.documents.map((doc, docIdx) => (
                  <div key={docIdx} className="document">
                    <FiFileText className="doc-icon" />
                    <span
                      className="doc-link"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDocument(doc)}
                    >
                      {doc.name}
                    </span>
                    <input
                      type="checkbox"
                      className="doc-checkbox"
                      checked={selectedDocs.some(d => d.id === doc.id)}
                      onChange={() => handleCheckboxChange(doc)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {criminalLawModules.audioOverview && <div className="extra-link">▶ Audio Overview</div>}
      {criminalLawModules.notesAndHighlights && <div className="extra-link">🗒️ Notes and Highlights</div>}
    </>
  )}
</div> */
}
