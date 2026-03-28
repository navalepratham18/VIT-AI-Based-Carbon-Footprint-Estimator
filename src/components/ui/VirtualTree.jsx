import { motion } from 'framer-motion';

const VirtualTree = ({ health = 'healthy', species = 'oak', size = 'md' }) => {
    // Colors based on health
    const colors = {
        healthy:   { leaf: '#00FFFF', trunk: '#4b3621' }, // Cyan
        neutral:   { leaf: '#fbbf24', trunk: '#4b3621' }, // amber/yellow
        unhealthy: { leaf: '#92400e', trunk: '#4b3621' }, // brown/withered
    };

    const currentColors = colors[health] || colors.healthy;

    // Scale mapping
    const scales = {
        sm: 0.6,
        md: 1,
        lg: 1.4
    };
    const scale = scales[size] || 1;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: scale, opacity: 1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative flex flex-col items-center justify-end h-24 w-16"
        >
            {/* Leaves / Canopy */}
            <motion.div
                animate={health === 'unhealthy' ? { rotate: [0, -1, 1, 0], transition: { repeat: Infinity, duration: 3 } } : {}}
                className="relative z-10"
            >
                {/* Simple SVG Tree Canopy */}
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {health === 'healthy' ? (
                        <>
                            <circle cx="30" cy="20" r="15" fill={currentColors.leaf} fillOpacity="0.9" />
                            <circle cx="20" cy="35" r="12" fill={currentColors.leaf} fillOpacity="0.8" />
                            <circle cx="40" cy="35" r="12" fill={currentColors.leaf} fillOpacity="0.8" />
                        </>
                    ) : health === 'neutral' ? (
                        <>
                            <path d="M30 5 L50 45 H10 L30 5Z" fill={currentColors.leaf} fillOpacity="0.8" />
                            <path d="M30 15 L45 45 H15 L30 15Z" fill={currentColors.leaf} fillOpacity="0.6" />
                        </>
                    ) : (
                        // Withered / Sparse
                        <>
                            <path d="M30 20 L35 10" stroke={currentColors.trunk} strokeWidth="2" strokeLinecap="round" />
                            <path d="M30 30 L45 25" stroke={currentColors.trunk} strokeWidth="2" strokeLinecap="round" />
                            <path d="M30 30 L15 25" stroke={currentColors.trunk} strokeWidth="2" strokeLinecap="round" />
                            <circle cx="25" cy="25" r="3" fill={currentColors.leaf} fillOpacity="0.6" />
                            <circle cx="40" cy="35" r="2" fill={currentColors.leaf} fillOpacity="0.4" />
                        </>
                    )}
                </svg>
            </motion.div>

            {/* Trunk */}
            <div 
                className="w-3 h-8 -mt-2 rounded-t-sm z-0"
                style={{ backgroundColor: currentColors.trunk }}
            />

            {/* Shadow/Base */}
            <div className="w-10 h-2 bg-black/20 rounded-[100%] blur-[2px] -mt-1" />
            
            {/* Label (Month/Year) - Optional tooltips can be added in parent */}
        </motion.div>
    );
};

export default VirtualTree;
