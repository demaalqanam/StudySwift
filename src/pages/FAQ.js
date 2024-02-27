import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { db } from "../config/firebase";
import { MyContext } from "../Context/Context";
import { AiFillDelete } from "react-icons/ai";

function FAQ() {
  const [faqsList, setFaqsList] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setOverlay, isAdmin } = useContext(MyContext);
  const FAQsRef = collection(db, "FAQs");
  const subject1 = useRef();
  const subject2 = useRef();
  const subject3 = useRef();
  const subject4 = useRef();
  const subject5 = useRef();

  useEffect(() => {
    getFaq();
  }, []);

  // Get FAQs data
  const getFaq = async (subject) => {
    try {
      const q = query(
        FAQsRef,
        where("subject", "==", subject !== undefined ? subject : "Logging")
      );
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFaqsList(List);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedSubject = (e) => {
    const subjects = [subject1, subject2, subject3, subject4, subject5];
    setLoading(true);
    subjects.map((s) => {
      s.current.classList.remove("active");
    });
    e.target.classList.add("active");
    getFaq(e.target.innerText);
  };

  /// Show create form
  const handleShowCreateForm = () => {
    setOverlay((current) => (current === true ? false : true));
    setShowForm((current) => (current === true ? false : true));
  };

  // Create new faq ////
  const handleCreateFaq = async (e) => {
    e.preventDefault();

    //// Creation
    try {
      await addDoc(FAQsRef, {
        title: e.target.title.value,
        description: e.target.description.value,
        subject: e.target.subject.value,
      }).then((res) => {
        getFaq(e.target.subject.value);
        handleShowCreateForm();
      });
    } catch (error) {
      console.error(error);
    }
  };

  /// Handle Delete Action ///
  const handleDelete = async (id, subject) => {
    try {
      const FAQDoc = doc(db, "FAQs", id);
      await deleteDoc(FAQDoc).then(() => {
        getFaq(subject);
      });
    } catch (error) {
      console.error(error);
    }
  };

  /// Create FAQ form ///
  const createForm = () => {
    return (
      <div className="create-form">
        <form onSubmit={handleCreateFaq}>
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" class="form-control" id="title" />
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea rows={4} class="form-control" id="description" />
          </div>
          <select
            id="subject"
            class="form-select"
            aria-label="Default select example"
          >
            <option defaultValue>Select the subject</option>
            <option value="Logging">Logging</option>
            <option value="Sessions">Sessions</option>
            <option value="Goals">Goals</option>
            <option value="Tasks">Tasks</option>
            <option value="Interface">Interface</option>
          </select>
          <button type="submit" class="btn c">
            Submit
          </button>
          <button onClick={handleShowCreateForm} type="" class="btn">
            Cancel
          </button>
        </form>
      </div>
    );
  };
  return (
    <>
      {showForm ? createForm() : ""}

      <div className="faq">
        <div className="row h-100">
          <div className="col-2">
            <div className="faq-sidebar">
              <ul>
                <li
                  ref={subject5}
                  onClick={(e) => handleSelectedSubject(e)}
                  className="active"
                >
                  Logging
                </li>
                <li ref={subject1} onClick={(e) => handleSelectedSubject(e)}>
                  Sessions
                </li>
                <li ref={subject2} onClick={(e) => handleSelectedSubject(e)}>
                  Goals
                </li>
                <li ref={subject3} onClick={(e) => handleSelectedSubject(e)}>
                  Tasks
                </li>
                <li ref={subject4} onClick={(e) => handleSelectedSubject(e)}>
                  Interface
                </li>
              </ul>
            </div>
          </div>
          <div className="col-10">
            <div className="faqs-col">
              <div className="faqs-header">
                <div className="h-text">
                  <h3>FAQs</h3>
                  <p>
                    Commonly asked questions regarding troubleshooting, logging
                    in, etc.
                  </p>
                </div>
                {isAdmin ? (
                  <div className="h-btns">
                    <button onClick={handleShowCreateForm} className="btn">
                      Create FAQ <IoMdAdd />{" "}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="faqs-body">
                {faqsList?.map((faq, index) => {
                  return (
                    <div hidden={loading} key={index} className="f-item">
                      {isAdmin ? (
                        <AiFillDelete
                          onClick={() => handleDelete(faq.id, faq.subject)}
                          className="icon"
                        />
                      ) : (
                        " "
                      )}
                      <h4>{faq.title}</h4>
                      <p>{faq.description}</p>
                    </div>
                  );
                })}
                {loading ? (
                  <div className="loading-c center">
                    <div class="spinner-border" role="status"></div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;
