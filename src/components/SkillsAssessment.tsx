import React, { useState } from 'react';
import { Plus, Trash2, Save, Star, Users, Clock, GraduationCap, AlertCircle, RotateCcw } from 'lucide-react';
import { MatchingConfig } from '../types';

interface SkillsAssessmentProps {
  activeSubSection: string;
  matchingConfig: MatchingConfig | null;
  onSaveMatchingConfig: (config: MatchingConfig) => void;
}

interface Skill {
  id: string;
  name: string;
  weight: number;
  required: boolean;
}

interface ExperienceRequirement {
  minYears: number;
  industrySpecific: boolean;
  industries: string[];
}

interface EducationRequirement {
  degree: string;
  field: string;
  required: boolean;
}

const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({ 
  activeSubSection, 
  matchingConfig, 
  onSaveMatchingConfig 
}) => {
  const [mandatorySkills, setMandatorySkills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript', weight: 10, required: true },
    { id: '2', name: 'React', weight: 15, required: true },
  ]);

  const [optionalSkills, setOptionalSkills] = useState<Skill[]>([
    { id: '1', name: 'Node.js', weight: 8, required: false },
    { id: '2', name: 'GraphQL', weight: 5, required: false },
  ]);

  const [weightage, setWeightage] = useState({
    mandatory: matchingConfig?.skillsWeightage.mandatory || 40,
    optional: matchingConfig?.skillsWeightage.optional || 30,
    experience: matchingConfig?.skillsWeightage.experience || 20,
    education: matchingConfig?.skillsWeightage.education || 10,
  });

  const [experienceReq, setExperienceReq] = useState<ExperienceRequirement>({
    minYears: matchingConfig?.minExperience || 3,
    industrySpecific: true,
    industries: ['Technology', 'Software Development']
  });

  const [educationReq, setEducationReq] = useState<EducationRequirement[]>([
    { degree: "Bachelor's", field: 'Computer Science', required: true },
    { degree: "Master's", field: 'Software Engineering', required: false },
  ]);

  const totalWeightage = weightage.mandatory + weightage.optional + weightage.experience + weightage.education;
  const isValidWeightage = totalWeightage === 100;

  const handleSaveConfiguration = () => {
    if (!isValidWeightage) {
      alert('Total weightage must equal 100%');
      return;
    }

    const config: MatchingConfig = {
      skillsWeightage: weightage,
      mandatorySkills: mandatorySkills.map(s => s.name),
      optionalSkills: optionalSkills.map(s => s.name),
      minExperience: experienceReq.minYears,
      requiredEducation: educationReq.filter(e => e.required).map(e => e.degree)
    };

    onSaveMatchingConfig(config);
    alert('Configuration saved successfully!');
  };

  const handleResetToDefaults = () => {
    setWeightage({
      mandatory: 40,
      optional: 30,
      experience: 20,
      education: 10,
    });
    setMandatorySkills([
      { id: '1', name: 'JavaScript', weight: 10, required: true },
      { id: '2', name: 'React', weight: 15, required: true },
    ]);
    setOptionalSkills([
      { id: '1', name: 'Node.js', weight: 8, required: false },
      { id: '2', name: 'GraphQL', weight: 5, required: false },
    ]);
    setExperienceReq({
      minYears: 3,
      industrySpecific: true,
      industries: ['Technology', 'Software Development']
    });
  };

  const addSkill = (type: 'mandatory' | 'optional') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      weight: type === 'mandatory' ? 10 : 5,
      required: type === 'mandatory'
    };

    if (type === 'mandatory') {
      setMandatorySkills([...mandatorySkills, newSkill]);
    } else {
      setOptionalSkills([...optionalSkills, newSkill]);
    }
  };

  const removeSkill = (id: string, type: 'mandatory' | 'optional') => {
    if (type === 'mandatory') {
      setMandatorySkills(mandatorySkills.filter(skill => skill.id !== id));
    } else {
      setOptionalSkills(optionalSkills.filter(skill => skill.id !== id));
    }
  };

  const updateSkill = (id: string, field: keyof Skill, value: any, type: 'mandatory' | 'optional') => {
    const updateSkills = (skills: Skill[]) =>
      skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill);

    if (type === 'mandatory') {
      setMandatorySkills(updateSkills(mandatorySkills));
    } else {
      setOptionalSkills(updateSkills(optionalSkills));
    }
  };

  const renderMandatorySkills = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Mandatory Skills</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={weightage.mandatory}
              onChange={(e) => setWeightage(prev => ({ ...prev, mandatory: parseInt(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-600">% Weight</span>
          </div>
        </div>
        <button
          onClick={() => addSkill('mandatory')}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Critical Rule</h4>
            <p className="text-sm text-red-700">
              If ANY mandatory skill is missing from a candidate's resume, their overall score will be set to 0.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mandatorySkills.map((skill) => (
          <div key={skill.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value, 'mandatory')}
              placeholder="Skill name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Weight:</label>
              <input
                type="number"
                value={skill.weight}
                onChange={(e) => updateSkill(skill.id, 'weight', parseInt(e.target.value), 'mandatory')}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                min="1"
                max="40"
              />
            </div>
            <button
              onClick={() => removeSkill(skill.id, 'mandatory')}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Total Weight: {mandatorySkills.reduce((sum, skill) => sum + skill.weight, 0)}/40
        </div>
      </div>
    </div>
  );

  const renderOptionalSkills = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Optional Skills</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={weightage.optional}
              onChange={(e) => setWeightage(prev => ({ ...prev, optional: parseInt(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-600">% Weight</span>
          </div>
        </div>
        <button
          onClick={() => addSkill('optional')}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="space-y-3">
        {optionalSkills.map((skill) => (
          <div key={skill.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value, 'optional')}
              placeholder="Skill name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Weight:</label>
              <input
                type="number"
                value={skill.weight}
                onChange={(e) => updateSkill(skill.id, 'weight', parseInt(e.target.value), 'optional')}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                min="1"
                max="30"
              />
            </div>
            <button
              onClick={() => removeSkill(skill.id, 'optional')}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Total Weight: {optionalSkills.reduce((sum, skill) => sum + skill.weight, 0)}/30
        </div>
      </div>
    </div>
  );

  const renderExperienceRequirements = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Experience Requirements</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={weightage.experience}
            onChange={(e) => setWeightage(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            min="0"
            max="100"
          />
          <span className="text-sm text-gray-600">% Weight</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Years Required
          </label>
          <input
            type="number"
            value={experienceReq.minYears}
            onChange={(e) => setExperienceReq({...experienceReq, minYears: parseInt(e.target.value)})}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={experienceReq.industrySpecific}
              onChange={(e) => setExperienceReq({...experienceReq, industrySpecific: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Industry-Specific Experience Required</span>
          </label>
        </div>

        {experienceReq.industrySpecific && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Industries
            </label>
            <div className="space-y-2">
              {experienceReq.industries.map((industry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => {
                      const newIndustries = [...experienceReq.industries];
                      newIndustries[index] = e.target.value;
                      setExperienceReq({...experienceReq, industries: newIndustries});
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newIndustries = experienceReq.industries.filter((_, i) => i !== index);
                      setExperienceReq({...experienceReq, industries: newIndustries});
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setExperienceReq({...experienceReq, industries: [...experienceReq.industries, '']})}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Industry</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducationRequirements = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <GraduationCap className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Education Requirements</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={weightage.education}
            onChange={(e) => setWeightage(prev => ({ ...prev, education: parseInt(e.target.value) || 0 }))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            min="0"
            max="100"
          />
          <span className="text-sm text-gray-600">% Weight</span>
        </div>
      </div>

      <div className="space-y-3">
        {educationReq.map((edu, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <select
              value={edu.degree}
              onChange={(e) => {
                const newEdu = [...educationReq];
                newEdu[index] = {...edu, degree: e.target.value};
                setEducationReq(newEdu);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High School">High School</option>
              <option value="Associate's">Associate's</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
            <input
              type="text"
              value={edu.field}
              onChange={(e) => {
                const newEdu = [...educationReq];
                newEdu[index] = {...edu, field: e.target.value};
                setEducationReq(newEdu);
              }}
              placeholder="Field of study"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={edu.required}
                onChange={(e) => {
                  const newEdu = [...educationReq];
                  newEdu[index] = {...edu, required: e.target.checked};
                  setEducationReq(newEdu);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Required</span>
            </label>
            <button
              onClick={() => setEducationReq(educationReq.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setEducationReq([...educationReq, { degree: "Bachelor's", field: '', required: false }])}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Requirement</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubSection) {
      case 'mandatory-skills':
        return renderMandatorySkills();
      case 'optional-skills':
        return renderOptionalSkills();
      case 'experience-requirements':
        return renderExperienceRequirements();
      case 'education-requirements':
        return renderEducationRequirements();
      default:
        return (
          <div className="space-y-6">
            {renderMandatorySkills()}
            {renderOptionalSkills()}
            {renderExperienceRequirements()}
            {renderEducationRequirements()}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills Assessment Configuration</h2>
        <p className="text-gray-600 mb-4">
          Configure the scoring criteria for resume evaluation. The total weight must equal 100%.
        </p>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{weightage.mandatory}%</div>
            <div className="text-sm text-red-700">Mandatory Skills</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{weightage.optional}%</div>
            <div className="text-sm text-blue-700">Optional Skills</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{weightage.experience}%</div>
            <div className="text-sm text-green-700">Experience</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{weightage.education}%</div>
            <div className="text-sm text-purple-700">Education</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-sm font-medium ${
            isValidWeightage ? 'text-green-600' : 'text-red-600'
          }`}>
            Total Weightage: {totalWeightage}% {isValidWeightage ? '✓' : '(Must equal 100%)'}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleResetToDefaults}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            <button 
              onClick={handleSaveConfiguration}
              disabled={!isValidWeightage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                isValidWeightage 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default SkillsAssessment;