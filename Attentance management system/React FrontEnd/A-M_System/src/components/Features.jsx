import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-slate-950">
      <div className="container mx-auto">
        <h2 className="text-center text-indigo-500">Our Features</h2>
        <h3 className="mt-2 text-3xl font-black text-center">
          Built and Designed with You in Mind
        </h3>
        <div className="flex flex-wrap justify-center mt-10 space-x-4">
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Automated Tools</h4>
            <p className="mt-2 text-gray-600">
              Automate your workflow with these top-line tools.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Machine Learning</h4>
            <p className="mt-2 text-gray-600">
              Harness AI for smarter business decisions.
            </p>
          </div>
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Cloud Integration</h4>
            <p className="mt-2 text-gray-600">
              Seamlessly integrate your data into the cloud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
