"use client";

import { Info, Brain, LineChart, History, HelpCircle } from "lucide-react";

export default function DocsContent() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl mx-auto leading-relaxed prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-li:marker:text-slate-400">
      {/* Overview */}
      <section id="overview" className="my-10">
        <h1 className="flex items-center gap-2">
          <Brain className="text-blue-600" size={28} />
          Neurocheck: A Guide to Understanding Your Predictive Results
        </h1>

        <h2>1. Overview — Your Personal Health Insights Navigator</h2>
        <p>
          Distinguishing between neurological conditions that share overlapping
          symptoms—such as{" "}
          <strong>
            Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)
          </strong>{" "}
          and <strong>Depression</strong>—is a major challenge.{" "}
          <strong>Neurocheck</strong> helps you make sense of your symptom
          patterns using clear, data-driven insights.
        </p>

        <p>
          Neurocheck is an automated web application that uses a{" "}
          <strong>machine learning model</strong> to generate a probabilistic
          prediction regarding potential neurological disorders. It’s designed
          to be a <em>predictive aid</em>, not a medical diagnosis.
        </p>

        <ol>
          <li>Start a diagnosis from the Home page.</li>
          <li>Enter symptoms through an interactive form.</li>
          <li>
            Receive a prediction — <em>Depression</em>, <em>ME/CFS</em>, or{" "}
            <em>Both</em> — with a confidence score.
          </li>
          <li>
            Understand results via an integrated chatbot that explains how each
            symptom contributed.
          </li>
          <li>Track progress by saving results in your personal history.</li>
        </ol>
      </section>

      <hr className="my-10" />

      {/* Depression */}
      <section id="depression" className="my-10">
        <h2>2. Interpreting a “Depression” Prediction</h2>
        <p>
          A <strong>“Depression”</strong> prediction is a probabilistic outcome
          based on learned patterns in your symptom data.
        </p>

        <ul>
          <li>
            <strong>Depression-specific metrics:</strong> Higher{" "}
            <code>depression_phq9_score</code> values strongly support
            depressive patterns.
          </li>
          <li>
            <strong>PEM absent:</strong> The lack of <code>pem_present</code>{" "}
            supports a Depression-only result.
          </li>
          <li>
            <strong>Fatigue severity:</strong> Lower{" "}
            <code>fatigue_severity_scale_score</code> aligns with a
            Depression-only classification.
          </li>
        </ul>
      </section>

      <hr className="my-10" />

      {/* ME/CFS */}
      <section id="mecfs" className="my-10">
        <h2>3. Interpreting an “ME/CFS” Prediction</h2>
        <ul>
          <li>
            <strong>Defining factor:</strong> Presence of{" "}
            <code>pem_present</code> overwhelmingly increases ME/CFS likelihood.
          </li>
          <li>
            <strong>Distinguishing from Depression:</strong> A high{" "}
            <code>depression_phq9_score</code> may indicate comorbid depressive
            features.
          </li>
          <li>
            <strong>Other contributors:</strong> Patterns in{" "}
            <code>hours_of_sleep_per_night</code> and related metrics can
            influence the outcome.
          </li>
        </ul>
      </section>

      <hr className="my-10" />

      {/* Both */}
      <section id="both" className="my-10">
        <h2>4. Interpreting a “Both” (Comorbidity) Prediction</h2>
        <p>
          A <strong>“Both”</strong> result suggests a pattern consistent with
          co-occurrence of Depression and ME/CFS.
        </p>

        <ul>
          <li>
            <code>pem_present = true</code> — post-exertional malaise symptoms
            are evident.
          </li>
          <li>
            <code>depression_phq9_score</code> is high, suggesting concurrent
            depressive features.
          </li>
        </ul>
      </section>

      <hr className="my-10" />

      {/* History */}
      <section id="history" className="my-10">
        <h2 className="flex items-center gap-2">
          <History size={22} className="text-blue-600" />
          5. The Power of History & Tracking
        </h2>
        <p>
          Tracking your symptom trends over time provides powerful insights.
          Historical data can reveal emerging patterns and support informed
          discussions with clinicians.
        </p>

        <ul>
          <li>Date and time of each test</li>
          <li>Symptoms entered</li>
          <li>Prediction type and confidence level</li>
        </ul>

        <p>
          <em>Upcoming features:</em> sorting, filtering, and CSV export for
          clinical sharing.
        </p>
      </section>

      <hr className="my-10" />

      {/* FAQ */}
      <section id="facts" className="my-10">
        <h2 className="flex items-center gap-2">
          <HelpCircle size={22} className="text-blue-600" />
          6. Facts & Frequently Asked Questions (FAQ)
        </h2>

        <ul>
          <li>
            Predictions are <strong>assistive tools</strong>, not medical
            diagnoses. Always consult a qualified professional.
          </li>
          <li>
            <strong>Confidence</strong> reflects model certainty in its detected
            patterns, not clinical severity.
          </li>
          <li>
            <strong>Technology:</strong> Optimized Logistic Regression model,
            compared against Decision Tree, SVM, and KNN — best performance.
          </li>
          <li>
            <strong>Reported metrics:</strong> High accuracy in controlled tests
            (real-world performance may vary).
          </li>
          <li>
            <strong>Data privacy:</strong> Account-based history enables
            tracking and secure data storage.
          </li>
        </ul>

        <h3>Additional Notes & Best Practices</h3>
        <ul>
          <li>Answer consistently and truthfully for more reliable results.</li>
          <li>
            If <code>pem_present</code> is true, use pacing — avoid
            boom-and-bust cycles.
          </li>
          <li>
            Focus on <strong>monthly trends</strong> instead of daily
            fluctuations.
          </li>
          <li>
            Export and share reports with clinicians to improve consultations.
          </li>
        </ul>

        <div className="mt-8 flex items-start gap-2 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-slate-800/40 rounded">
          <Info className="text-blue-600 mt-0.5" size={20} />
          <p className="m-0">
            <strong>Reminder:</strong> Neurocheck is an analytical aid meant to
            support—not replace—professional medical evaluation.
          </p>
        </div>
      </section>
    </article>
  );
}
