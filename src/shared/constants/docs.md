Neurocheck: A Guide to Understanding Your Predictive Results

1. Overview: Your Personal Health Insights Navigator

Distinguishing between neurological conditions that share overlapping symptoms, such as Myalgic Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS) and Depression, is a significant challenge. The Institute for Neurological Health identified this as a critical area where diagnostic accuracy could be improved. Neurocheck was developed as an innovative solution to this problem, offering users clear, data-driven insights into their symptom patterns.

Neurocheck is an automated web application that utilizes a sophisticated machine learning model to generate a prediction regarding potential neurological disorders. It is designed to be a predictive aid, helping you navigate and understand your health data in a structured way.

The user journey through the application is straightforward and designed for clarity:

1. Start Diagnosis: From the home page, you can initiate the process at any time by selecting "Start Diagnosis."
2. Symptom Input: You will be guided to an interactive form where you can input key information about your symptoms. This data is essential for the model to perform its analysis.
3. Receive Prediction: Upon submitting the form, the model processes your data instantly. You will receive a prediction—Depression, ME/CFS, or Both—along with a confidence score that indicates the model's certainty in its result.
4. Understand Results: For a deeper understanding of what your result means, you can engage with a specialized chatbot powered by Gemini Pro. This tool is designed to explain which of your symptoms most influenced the prediction.
5. Track Progress: You have the option to save your results to a secure, personal history log. This allows you to monitor your symptoms and prediction patterns over time.

This guide will now delve into the specifics of each possible predictive outcome, explaining how the Neurocheck model interprets your data to arrive at its conclusions.

2. Interpreting a "Depression" Prediction

This section demystifies what a "Depression" prediction means within the context of the Neurocheck model. The model's prediction is not arbitrary; it is a probabilistic assessment based on a learned pattern in your data. Understanding the key data points that lead to this prediction is the first step toward gaining valuable insight.

The machine learning model identifies several primary symptoms and data points as strong indicators for a Depression prediction. These factors, when present in a particular combination, guide the model's conclusion.

- Depression-Specific Metrics: The most significant factor pointing toward this prediction is a higher score on the Patient Health Questionnaire-9 (depression_phq9_score). The model has learned that this score is a strong positive indicator for Depression.
- Post-Exertional Malaise (PEM): The absence of Post-Exertional Malaise (pem_present) is the most powerful evidence the model uses for a Depression-only prediction. The lack of this cardinal symptom for ME/CFS provides the strongest signal to the model to rule out other conditions in favor of Depression.
- Fatigue Severity: A lower score on the fatigue_severity_scale_score contributes to a "Depression" prediction. The model has learned that while fatigue is present, its severity is often less pronounced in cases of Depression alone compared to ME/CFS or comorbid cases.

It is the specific combination of these factors, especially a high PHQ-9 score in the absence of definitive PEM, that guides the model's prediction. This nuanced analysis helps distinguish Depression from conditions like ME/CFS, which often share the symptom of fatigue.

3. Interpreting an "ME/CFS" Prediction

This section will break down the key differentiators that cause the Neurocheck model to predict ME/CFS. While some symptoms may overlap with Depression, the model is trained to recognize a unique signature of data points strongly associated with ME/CFS.

The model's logic for an ME/CFS prediction relies on several critical factors that help it distinguish this condition from others.

- The Defining Factor: The single most crucial factor for an ME/CFS prediction is the presence of Post-Exertional Malaise (pem_present). The model identifies this as the cardinal symptom, and its presence overwhelmingly increases the probability of an ME/CFS result.
- Distinguishing from Depression: To further refine its prediction, the model uses the depression score as a point of contrast. A high depression_phq9_score has a strong negative effect on a pure ME/CFS prediction. This means the model interprets a high depression score as evidence against ME/CFS alone, helping it separate the two conditions when they are not co-occurring.
- Other Contributing Factors: The model also incorporates other data points to support its conclusion. For example, patterns in the reported hours_of_sleep_per_night can also influence the outcome, adding another layer to the predictive analysis.

Having explored the distinct patterns for Depression and ME/CFS, we can now examine the more complex scenario where symptoms of both conditions are present simultaneously.

4. Interpreting a "Both" (Comorbidity) Prediction

A prediction of "Both" signifies that the model has detected a pattern of symptoms consistent with both Depression and ME/CFS occurring at the same time. This result represents a distinct clinical pattern that the model is specifically trained to recognize, indicating the likely co-occurrence of both conditions.

The analysis reveals that a powerful combination of two key factors most strongly points to a comorbid prediction. When the model sees both of these indicators simultaneously, it classifies the result as "Both."

The presence of Post-Exertional Malaise (pem_present). A high score on the depression_phq9_score.

The significance of this combination is clear: the model identifies the primary clinical marker for ME/CFS (pem_present) occurring alongside the primary clinical marker for Depression (a high depression_phq9_score). It is this concurrent presentation of defining symptoms that leads directly to the "Both" classification. This allows for a more nuanced insight than simply choosing one condition over the other. Understanding a single result is useful, but tracking these results over time unlocks even greater potential.

5. The Power of History & Tracking

The History feature is more than just a log; it is a powerful tool for self-awareness and for facilitating more productive and informed conversations with healthcare providers. By tracking your symptoms and the model's predictions over time, you can identify patterns, observe changes, and build a comprehensive personal health record that is easy to reference and understand.

The Neurocheck application securely saves the following information in your personal history log each time you choose to record a result:

- Date and time of the test
- The specific symptoms entered by you
- The prediction result (Depression, ME/CFS, or Both)
- The confidence level (probability) of the prediction

Future enhancements to this feature are being considered, including the ability to sort and filter your results and export your entire history to a CSV file for personal records or to share with a clinician. This ability to track your health journey over time underscores the importance of understanding the principles behind the tool, which we will address in the following FAQ.

6. Facts & Frequently Asked Questions (FAQ)

This section provides clear, direct answers to common questions about how Neurocheck works, its accuracy, and its intended use as a health insights tool.

What is Neurocheck and how does it generate a prediction? Neurocheck is a web application that uses a machine learning model to provide predictive insights into neurological health. The process begins when a user inputs their symptoms into a structured form. This data is then processed by the model, which generates a prediction (Depression, ME/CFS, or Both) and a confidence score. An integrated chatbot, powered by Gemini Pro, is available to help explain the results and the symptoms that most influenced them.

What technology is behind the predictions? The predictions are powered by a highly optimized Logistic Regression machine learning model. This specific model was chosen after a rigorous development process that compared its performance against several alternatives, including Decision Tree, Support Vector Machine (SVM), and K-Nearest Neighbors (KNN). The final model was carefully tuned to achieve the highest possible performance on the dataset.

How accurate is the Neurocheck model? During the development and testing phases, the final optimized model demonstrated excellent performance on its test dataset, achieving an F1-score and Accuracy of 0.992 and a ROC-AUC score of 0.989.

These metrics reflect the model's performance in a controlled, analytical environment. They are not a guarantee of clinical accuracy in all real-world scenarios. The tool is intended to provide insights, not definitive diagnoses.

Is a Neurocheck prediction a medical diagnosis? No. It is crucial to understand that Neurocheck is a predictive tool designed to provide insights based on symptom patterns. It is not a substitute for a professional medical diagnosis, and its results should not be used to make medical decisions. We strongly advise all users to consult with a qualified healthcare provider for any and all medical concerns.

Why do I need to create an account? User accounts are a necessary security measure to protect your privacy and enable the core features of the application. Creating an account allows you to save your results to a personal history log and track them over time. Unauthorized users cannot use the diagnosis feature or save their results, ensuring that your sensitive health data remains private and secure.

What happens with my data? The symptom data you provide is used by the machine learning model to generate your prediction. If you choose to save your result, that information—including the date, symptoms, prediction, and confidence score—is stored in your personal history within the application's secure PostgreSQL database.
