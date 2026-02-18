'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { IoReload } from 'react-icons/io5';
import { FiUploadCloud } from 'react-icons/fi';

type Category = string;

type ScheduleRow = {
  id?: string;
  day_of_week: number;
  category: string | null;
  questions: string[];
  questionTitles?: string[];
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: catData } = await supabase.from('quiz_questions').select('category');
      const allCats = Array.from(new Set(catData?.map((q) => q.category).filter(Boolean))) as string[];
      setCategories(allCats);

      const { data: scheduleData } = await supabase.from('daily_quiz_schedule').select('*');

      const allQuestionIds = (scheduleData ?? []).flatMap((row) => row.questions);
      const { data: questionData } = await supabase
        .from('quiz_questions')
        .select('id, question')
        .in('id', allQuestionIds);

      const questionMap = new Map(questionData?.map((q) => [q.id, q.question]));

      const fullSchedule: ScheduleRow[] = Array.from({ length: 7 }, (_, i) => {
        const row = scheduleData?.find((r) => r.day_of_week === i);
        return {
          day_of_week: i,
          id: row?.id,
          category: row?.category ?? '',
          questions: row?.questions ?? [],
          questionTitles: row?.questions.map((qid: string) => questionMap.get(qid) ?? '(Not found)') ?? [],
        };
      });

      setSchedule(fullSchedule);
      setLoading(false);
    }

    loadData();
  }, []);

  async function refreshQuestions(dayIndex: number) {
    const category = schedule[dayIndex].category;
    if (!category) return;

    setRefreshing(dayIndex);

    const usedIds = schedule.flatMap((row, i) => (i === dayIndex ? [] : row.questions));

    const { data: questions, error } = await supabase.rpc('get_random_questions', {
      p_category: category,
      p_exclude_ids: usedIds,
      p_limit: 5,
    });

    if (error || !questions || questions.length === 0) {
      alert('No enough unique questions available for this category.');
      setRefreshing(null);
      return;
    }

    const updated = [...schedule];
    updated[dayIndex].questions = questions.map((q: { id: string }) => q.id);
    updated[dayIndex].questionTitles = questions.map((q: { question: string }) => q.question);
    setSchedule(updated);
    setRefreshing(null);
  }

  async function publishSchedule() {
    setPublishing(true);

    for (const row of schedule) {
      if (!row.category || row.questions.length < 5) continue;

      if (row.id) {
        await supabase.from('daily_quiz_schedule').update({
          category: row.category,
          questions: row.questions,
        }).eq('id', row.id);
      } else {
        await supabase.from('daily_quiz_schedule').insert({
          day_of_week: row.day_of_week,
          category: row.category,
          questions: row.questions,
        });
      }
    }

    setPublishing(false);
    alert('Schedule published successfully!');
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Daily Quiz Schedule</h1>
        <button
          onClick={publishSchedule}
          disabled={publishing}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          <FiUploadCloud size={18} />
          {publishing ? 'Publishing...' : 'Publish Schedule'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">Day</th>
              <th className="border px-2 py-2">Category</th>
              <th className="border px-2 py-2">Preview Questions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={row.day_of_week}>
                <td className="border px-2 py-2 text-center font-semibold">{DAYS[row.day_of_week]}</td>
                <td className="border px-2 py-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={row.category ?? ''}
                      onChange={(e) => {
                        const newSchedule = [...schedule];
                        newSchedule[index].category = e.target.value;
                        newSchedule[index].questions = [];
                        newSchedule[index].questionTitles = [];
                        setSchedule(newSchedule);
                      }}
                    >
                      <option value="">-- Select --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => refreshQuestions(index)}
                      disabled={!row.category || refreshing === index}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      <IoReload className={`inline-block ${refreshing === index ? 'animate-spin' : ''}`} size={18} />
                    </button>
                  </div>
                </td>
                <td className="border px-2 py-2 text-gray-600">
                  <ul className="list-disc ml-4">
                    {row.questionTitles?.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
