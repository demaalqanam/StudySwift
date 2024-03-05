import React, { useEffect } from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

function MotivationPoup() {
  const [quotes, setQuotes] = React.useState([]);
  const [randomQuote, setRandomQuote] = React.useState("");
  const [color, setColor] = React.useState("#acb63f");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await fetch("https://type.fit/api/quotes");
    const data = await response.json();
    setQuotes(data);
    let randIndex = Math.floor(Math.random() * data.length);
    setRandomQuote(data[randIndex]);
  }

  function removeWord(sentence) {
    // Create a regular expression to match the wordToRemove
    const regex = new RegExp("\\b" + "type.fit" + "\\b", "gi");

    // Replace the matched word with an empty string
    const newSentence = sentence.replace(regex, "");

    return newSentence.trim(); // Trim any leading or trailing spaces
  }

  const getNewQuote = () => {
    const colors = [
      "#acb63f",
      "#5ba6c6",
      "#198754",
      "#ffc107",
      "#6c757d",
      "#224d73",
      "#dc3545",
    ];
    let randIndex = Math.floor(Math.random() * quotes.length);
    let randColorIndex = Math.floor(Math.random() * colors.length);

    setRandomQuote(quotes[randIndex]);
    setColor(colors[randColorIndex]);
  };

  return (
    <div className="jumbotron" id="quote-box">
      <div className="card">
        <div className="card-header">Inspirational Quotes</div>
        <div className="card-body text-center">
          {randomQuote ? (
            <>
              <h4 id="text" className="card-text">
                &quot;{randomQuote.text}&quot;
              </h4>
              <h5 id="author" className="card-title mb-4">
                ~ {removeWord(randomQuote.author) || "Anonymous"}
              </h5>
            </>
          ) : (
            <h2>Loading...</h2>
          )}
          <div className="flex">
            <>
              {/* <div className="child1">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    randomQuote ? randomQuote.text : ""
                  )}`}
                  className="btn btn-primary center btn-block"
                  target="_blank"
                  id="tweet-quote"
                >
                  <FaTwitter className="icon" />
                </a>
              </div>
              <div className="child2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  className="btn btn-primary center btn-block"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="facebook-quote"
                >
                  <FaFacebook className="icon" />
                </a>
              </div> */}
            </>
            <div className="child3">
              <button
                id="new-quote"
                style={{ backgroundColor: color }}
                onClick={getNewQuote}
                className="btn btn-success btn-block"
              >
                New Quote
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="text-center pt-5">
        <b>By Kalutu Daniel</b>
      </div> */}
    </div>
  );
}

export default MotivationPoup;
