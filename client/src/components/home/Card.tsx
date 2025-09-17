interface CardProps {
  title: string;
  description: string;
  image: string;
}

const Card = ({ title, description, image }: CardProps) => {
  return (
    <div className="flex flex-col">
      <img className="w-[316px] h-190 rounded-10" src={image} alt={title} />
      <div className="px-11">
        <h3 className="text-22 font-medium text-gray900 mt-20">{title}</h3>
        <p className="text-16 text-gray600 mt-10">{description}</p>
      </div>
    </div>
  );
};

export default Card;
