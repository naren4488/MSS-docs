import type { BrochureData } from "../types/brochure";

interface BrochureContentProps {
  data: BrochureData;
}

const serviceIcons = [
  "🔍", "⭐", "🛡️", "⚡", "✅", "🎯", "💬", "🚨", "📈", "🔒"
];

export function BrochureContent({ data }: BrochureContentProps) {
  return (
    <div className="brochure-content w-full bg-white print:p-0" style={{ fontFamily: "'Raleway', sans-serif" }}>
      {/* Premium Header Section */}
      <div
        className="px-8 py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
          borderBottom: "6px solid #F2DA00"
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5" style={{ backgroundColor: "#864797", borderRadius: "50%" }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div style={{ width: "6px", height: "50px", backgroundColor: "#F2DA00", borderRadius: "3px" }}></div>
            <div>
              <h1
                className="text-5xl font-bold mb-2 leading-tight"
                style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
              >
                {data.company.name}
              </h1>
              <p
                className="text-base font-semibold tracking-widest"
                style={{ color: "#F2DA00" }}
              >
                {data.company.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Hero Section */}
      <div
        className="px-8 py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2f3342 0%, #1a1d25 100%)"
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ backgroundColor: "#F2DA00", borderRadius: "50%" }}></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="mb-6 text-6xl">☀️</div>
          <h2
            className="text-5xl font-bold mb-6 leading-tight"
            style={{ color: "#F2DA00", fontFamily: "'Poppins', sans-serif" }}
          >
            {data.hero.title}
          </h2>
          <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            {data.hero.subtitle}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              style={{
                backgroundColor: "#F2DA00",
                color: "#2f3342",
                padding: "12px 32px",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "14px",
                border: "none",
                cursor: "pointer"
              }}
            >
              GET A FREE QUOTE
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: "#F2DA00",
                padding: "12px 32px",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "14px",
                border: "2px solid #F2DA00",
                cursor: "pointer"
              }}
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-8 py-12" style={{ backgroundColor: "#864797" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>500+</p>
              <p className="text-gray-200 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>12+</p>
              <p className="text-gray-200 text-sm">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>2.5MW+</p>
              <p className="text-gray-200 text-sm">Total Capacity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Services Section */}
      <div className="px-8 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-2">
              <div style={{ width: "6px", height: "40px", backgroundColor: "#F2DA00", borderRadius: "3px" }}></div>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
              >
                {data.services.title}
              </h2>
            </div>
            <p className="text-gray-600 mt-3">Comprehensive solutions backed by industry-leading standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.services.items.map((item, idx) => {
              const [title, ...content] = item.split('\n');
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-l-4"
                  style={{
                    borderColor: "#864797",
                    backgroundColor: "#FFFFFF",
                    borderLeft: "6px solid #864797"
                  }}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl">{serviceIcons[idx % serviceIcons.length]}</div>
                    <h3
                      className="font-bold text-lg leading-tight"
                      style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
                    >
                      {title.trim()}
                    </h3>
                  </div>
                  <p
                    className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ml-11"
                  >
                    {content.join('\n').trim()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Section - Enhanced */}
      <div className="px-8 py-20" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-2">
              <div style={{ width: "6px", height: "40px", backgroundColor: "#F2DA00", borderRadius: "3px" }}></div>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
              >
                {data.whyChoose.title}
              </h2>
            </div>
            <p className="text-gray-600 mt-3">Trust the solar experts in Rajasthan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.whyChoose.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl transition duration-300"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #F2DA00",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: "#864797",
                      fontSize: "18px"
                    }}
                  >
                    ✓
                  </div>
                  <span className="text-gray-800 font-medium pt-1">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Warranty Section */}
      <div className="px-8 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-2">
              <div style={{ width: "6px", height: "40px", backgroundColor: "#F2DA00", borderRadius: "3px" }}></div>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
              >
                {data.warranty.title}
              </h2>
            </div>
            <p className="text-gray-600 mt-3">Industry-leading warranty coverage for your peace of mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.warranty.items.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl text-center relative overflow-hidden group"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #F2DA00",
                  transition: "all 0.3s ease"
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 group-hover:h-2 transition"
                  style={{ backgroundColor: "#F2DA00" }}
                ></div>
                <div className="text-3xl mb-3">🏆</div>
                <p
                  className="font-semibold text-base"
                  style={{ color: "#864797", fontFamily: "'Poppins', sans-serif" }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="px-8 py-16 border-t-2 border-b-2" style={{ borderColor: "#F2DA00", backgroundColor: "#F5F5F5" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-bold tracking-wider mb-6" style={{ color: "#864797" }}>TRUSTED BY THOUSANDS OF CUSTOMERS</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#864797" }}>✓</p>
              <p className="text-xs text-gray-600 mt-1">JVVNL Authorized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#864797" }}>✓</p>
              <p className="text-xs text-gray-600 mt-1">BIS Certified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#864797" }}>✓</p>
              <p className="text-xs text-gray-600 mt-1">ISO Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#864797" }}>✓</p>
              <p className="text-xs text-gray-600 mt-1">5-Star Rated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Contact Section */}
      <div
        className="px-8 py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2f3342 0%, #1a1d25 100%)"
        }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 opacity-10" style={{ backgroundColor: "#F2DA00", borderRadius: "50%" }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2
            className="text-4xl font-bold mb-12"
            style={{ color: "#F2DA00", fontFamily: "'Poppins', sans-serif" }}
          >
            READY TO SAVE ON ELECTRICITY?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "rgba(242, 218, 0, 0.1)",
                border: "2px solid #F2DA00"
              }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: "#F2DA00" }}>📞 CALL NOW</p>
              <p className="text-2xl font-bold text-white mb-2">{data.contact.phone}</p>
              <p className="text-sm text-gray-300">Available Monday to Saturday, 9 AM to 6 PM</p>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "rgba(242, 218, 0, 0.1)",
                border: "2px solid #F2DA00"
              }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: "#F2DA00" }}>📧 EMAIL US</p>
              <p className="text-2xl font-bold text-white mb-2">{data.contact.email}</p>
              <p className="text-sm text-gray-300">We'll respond within 24 hours</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: "#F2DA00" }}>🌐 WEBSITE</p>
              <p className="text-white">{data.contact.website}</p>
            </div>
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: "#F2DA00" }}>📍 LOCATION</p>
              <p className="text-white text-sm">{data.contact.address}</p>
            </div>
          </div>

          <button
            style={{
              backgroundColor: "#F2DA00",
              color: "#2f3342",
              padding: "14px 40px",
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            REQUEST FREE CONSULTATION
          </button>
        </div>
      </div>

      {/* Premium Footer */}
      <div
        className="px-8 py-12 text-center border-t-4"
        style={{ backgroundColor: "#1a1d25", borderColor: "#F2DA00" }}
      >
        <p
          className="text-sm font-bold tracking-wider mb-4"
          style={{ color: "#F2DA00" }}
        >
          ✓ JVVNL AUTHORISED | ✓ BIS CERTIFIED | ✓ ISO COMPLIANT | ✓ LIFETIME SUPPORT
        </p>
        <p className="text-xs text-gray-500">
          © 2026 Mahi Solar Solution Private Limited. All rights reserved. | GST: 08AAUCM4104G1ZD
        </p>
        <p className="text-xs text-gray-600 mt-3">
          Powering Sustainable Futures • One Solar Installation at a Time
        </p>
      </div>
    </div>
  );
}
